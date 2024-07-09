import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { UserInfoService } from '../userInfo';


export const TokenInterceptorFunction: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

    const notification = inject(NzNotificationService)
    const auth = inject(UserInfoService)

    const token = localStorage.getItem('token');
    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                notification.error('Error', 'Login session expired. Please login again.');
                auth.logout()
                return throwError(error);
            }else{
                return throwError(error);
            }
        }
    ))
}