import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, switchMap, throwError } from 'rxjs';
import { SecurityService } from './security.service';

const apiRootUrl = 'http://localhost:3000/api';
const accountBaseUrl = `${apiRootUrl}/account`;
const publicRoutes = [
  `${accountBaseUrl}/signin`,
  `${accountBaseUrl}/signup`,
  `${accountBaseUrl}/refresh`,
];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const service = inject(SecurityService);
  const router = inject(Router);
  const token = service.getToken();

  if (!request.url.startsWith(apiRootUrl) || publicRoutes.includes(request.url)) {
    return next(request);
  }

  if (!token) {
    void router.navigateByUrl('/');
    return EMPTY;
  }

  return next(addTokenInHeader(request, token)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 && error.status !== 403) {
        return throwError(() => error);
      }

      if (!service.getRefreshToken()) {
        service.logout();
        void router.navigateByUrl('/');
        return EMPTY;
      }

      return service.refresh().pipe(
        switchMap((response) => next(addTokenInHeader(request, response.data.token))),
        catchError(() => {
          service.logout();
          void router.navigateByUrl('/');
          return EMPTY;
        }),
      );
    }),
  );
};

const addTokenInHeader = (request: Parameters<HttpInterceptorFn>[0], token: string) =>
  request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
