import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, exhaustMap, switchMap, take } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth.service";
import { LocalStorageService } from "../localstorage.service";
import { BehaviorSubject, Observable, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService,
                private localService: LocalStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.localService.getItem("Token");

        if (!token) {
            return next.handle(req);
        }

        return next.handle(this.addToken(req, token.accessToken)).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(req, next);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const token = this.localService.getItem("Token");

            return this.authService.refreshToken(token.refreshToken).pipe(
                switchMap((response: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.token);
                    const updatedReq = this.addToken(req, response.token.accessToken);
                    return next.handle(updatedReq);
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    // Token yenileme başarısızsa logout işlemi yapabilirsin veya hata atabilirsin
                    return throwError(error);
                })
            );
        } else {
            // Eğer refreshTokenSubject null değilse, değer alana kadar bekleriz
            return this.refreshTokenSubject.pipe(
                take(1),
                switchMap((token) => {
                    const updatedReq = this.addToken(req, token);
                    return next.handle(updatedReq);
                })
            );
        }
    }
}
