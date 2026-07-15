import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GlobalStateService } from './global-state.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);
    private state = inject(GlobalStateService);
    private router = inject(Router);
    private http = inject(HttpClient);
    private readonly TOKEN_COOKIE = 'mamilo_auth_token';
    private readonly API_URL = 'https://api.christianmamilo.com/api/v1';

    constructor() {
        if (this.isBrowser) {
            this.checkAuth();
        } else {
            this.state.setAuthInitialized(true);
        }
    }

    login(credentials: { email: string; password?: string }) {
        this.state.setLoading(true);

        return this.http
            .post<{ success: boolean; message: string; data: { accessToken: string; user: User } }>(
                `${this.API_URL}/auth/login`,
                {
                    email: credentials.email,
                    password: credentials.password
                }
            )
            .pipe(
                tap(res => {
                    if (this.isBrowser) {
                        this.setSessionCookie(this.TOKEN_COOKIE, res.data.accessToken);
                    }
                    this.state.setAuthenticatedUser(res.data.user);
                    this.state.setLoading(false);
                }),
                map(() => true),
                catchError(err => {
                    const message = err?.error?.message || 'Identifiants invalides';
                    this.state.setError(message);
                    this.state.setLoading(false);
                    return throwError(() => err);
                })
            );
    }

    me() {
        return this.http
            .get<{ success: boolean; message: string; data: User }>(
                `${this.API_URL}/auth/me`
            )
            .pipe(
                map(res => res.data)
            );
    }

    logout() {
        if (this.isBrowser) {
            this.deleteCookie(this.TOKEN_COOKIE);
        }
        this.state.setAuthenticatedUser(null);
        this.router.navigate(['/']);
    }

    checkAuth() {
        if (!this.isBrowser) return;

        const token = this.getCookie(this.TOKEN_COOKIE);
        if (!token) {
            this.state.setAuthInitialized(true);
            return;
        }

        this.me().subscribe({
            next: user => {
                this._state_user_init(user);
                this.state.setAuthInitialized(true);
            },
            error: () => {
                this.deleteCookie(this.TOKEN_COOKIE);
                this.state.setAuthenticatedUser(null);
                this.state.setAuthInitialized(true);
            }
        });
    }

    private _state_user_init(user: any) {
        this.state.setAuthenticatedUser(user);
    }

    private setSessionCookie(name: string, value: string) {
        if (!this.isBrowser) return;
        const isHttps = typeof window !== 'undefined' && window.location?.protocol === 'https:';
        // 30 days expiration
        const maxAge = 30 * 24 * 60 * 60;
        const parts = [
            `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
            'Path=/',
            `Max-Age=${maxAge}`,
            'SameSite=Lax'
        ];
        if (isHttps) parts.push('Secure');
        document.cookie = parts.join('; ');
    }

    private getCookie(name: string): string | null {
        if (!this.isBrowser) return null;
        const encoded = encodeURIComponent(name) + '=';
        const cookies = document.cookie ? document.cookie.split(';') : [];
        for (let c of cookies) {
            c = c.trim();
            if (c.startsWith(encoded)) {
                return decodeURIComponent(c.substring(encoded.length));
            }
        }
        return null;
    }

    private deleteCookie(name: string) {
        if (!this.isBrowser) return;
        document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
}
