import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.loaderService.show();

    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {
            this.handleUnauthorized();
          }
        }
        return event;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.hide();
      }),
    );
  }

  private handleUnauthorized() {
    this.toastr.error('Unauthorized.', 'Error');
    this.authService.logout()
    this.router.navigate(['/login']);
  }
}
