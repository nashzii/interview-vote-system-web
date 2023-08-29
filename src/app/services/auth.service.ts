import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = environment.apiUrl;

  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  public token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log(environment)
    return this.http
      .post<ILoginResponse>(this.endpoint + '/auth/login', {
        username,
        password,
      })
      .pipe(
        tap({
          next: (res) => {
            this.setProfile(res.user);
            this.setToken(res.access_token);
          },
        }),
      );
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.tokenSubject.next(token);
  }

  setProfile(user: IUser): void {
    localStorage.setItem('profile', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getProfile(): IUser | null {
    const profile = localStorage.getItem('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return null;
  }

  logout(): void {
    localStorage.clear();
    this.tokenSubject.next(null);
  }
}

interface ILoginResponse {
  access_token: string;
  user: IUser;
}

export interface IUser {
  firstName: string;
  lastName: string;
}
