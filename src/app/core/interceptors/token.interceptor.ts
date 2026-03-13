import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    // Simulate getting token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('mamilo_auth_token') : null;

    if (token) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
    }

    return next(req);
};
