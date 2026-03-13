import { Injectable, inject } from '@angular/core';
import { GlobalStateService } from './global-state.service';
import { MOCK_USER } from '../../mock-data/data/users.mock';
import { Router } from '@angular/router';
import { of, delay, tap, catchError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private state = inject(GlobalStateService);
    private router = inject(Router);
    private readonly STORAGE_KEY = 'mamilo_auth_user';

    constructor() {
        this.checkAuth();
    }

    login(credentials: { email: string; password?: string }) {
        this.state.setLoading(true);

        // Simulate API delay
        return of(MOCK_USER).pipe(
            delay(1200),
            tap(user => {
                // In a real app, we'd store a JWT token here
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
                localStorage.setItem('mamilo_auth_token', 'simulated-jwt-token-xyz-123');

                this.state.setUser(user);
                this.state.setLoading(false);
            }),
            catchError(err => {
                this.state.setError('Identifiants invalides');
                this.state.setLoading(false);
                throw err;
            })
        );
    }

    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem('mamilo_auth_token');
        this.state.setUser(null);
        this.router.navigate(['/']);
    }

    checkAuth() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const savedUser = localStorage.getItem(this.STORAGE_KEY);
            if (savedUser) {
                try {
                    this._state_user_init(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem(this.STORAGE_KEY);
                }
            }
        }
    }

    private _state_user_init(user: any) {
        this.state.setUser(user);
    }
}
