import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Request Intercepted')
        if (this.authService.getCurrentUserData().access_token) {
            const modReq = req.clone({
                setHeaders: {
                    'authorization': 'Bearer ' + this.authService.getCurrentUserData().access_token
                }
            });
            return next.handle(modReq).pipe(catchError(x => this.handleAuthError(x)));
        }
        return next.handle(req).pipe(catchError(x => this.handleAuthError(x)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        if (err.status === 401 || err.status === 403) {
            this.router.navigateByUrl(`/login`);
            return of(err.message);
        }
        return throwError(err);
    }
}
