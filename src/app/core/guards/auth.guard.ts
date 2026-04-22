import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { GlobalStateService } from '../services/global-state.service';
import { Observable, filter, map, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private state = inject(GlobalStateService);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    private isAuthInitialized$ = toObservable(this.state.isAuthInitialized);

    canActivate(): Observable<boolean | UrlTree> {
        // Defer auth check to client if on server
        if (!isPlatformBrowser(this.platformId)) {
            return new Observable(obs => {
                obs.next(true);
                obs.complete();
            });
        }
        return this.isAuthInitialized$.pipe(
            filter(initialized => initialized),
            take(1),
            map(() => {
                if (this.state.isAuthenticated()) {
                    return true;
                }
                return this.router.createUrlTree(['/login']);
            })
        );
    }
}
