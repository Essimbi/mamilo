import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { GlobalStateService } from '../services/global-state.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private state = inject(GlobalStateService);
    private router = inject(Router);

    canActivate(): boolean | UrlTree {
        if (this.state.isAuthenticated()) {
            return true;
        }

        // Redirect to login page with return url
        return this.router.createUrlTree(['/login']);
    }
}
