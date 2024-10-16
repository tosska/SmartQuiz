import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { AuthService } from "../_services/auth/auth.service";

// Interceptor to add the Authorization header with the token to the request

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        // Clone the request and add the Authorization header with the token
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    }

    return next(request);
}