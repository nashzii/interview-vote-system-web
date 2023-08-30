import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.token$.pipe(
      map((token) => {
        if (!!token) {
          return true;
        } else {
          if (!!this.authService.getToken()) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }
      }),
    );
  }
}
