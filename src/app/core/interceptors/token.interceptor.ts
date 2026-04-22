import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const token = typeof document !== 'undefined' ? getCookie('mamilo_auth_token') : null;

    if (token) {
        const authReq = req.clone({
            headers: req.headers
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
        });
        return next(authReq);
    }

    const jsonReq = req.clone({
        headers: req.headers.set('Accept', 'application/json')
    });

    return next(jsonReq);
};

function getCookie(name: string): string | null {
    const encoded = encodeURIComponent(name) + '=';
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
        if (c.startsWith(encoded)) {
            return decodeURIComponent(c.substring(encoded.length));
        }
    }
    return null;
}
