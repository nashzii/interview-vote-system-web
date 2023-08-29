import { Component, OnInit } from '@angular/core';
import { AuthService, IUser } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  profile: IUser | null = null;
  isLoggedIn = false;
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = authService.token$.subscribe((token) => {
      this.profile = this.authService.getProfile();
      this.isLoggedIn = !!token;
    });
  }

  transformName(value: string | undefined): string {
    if (!value) {
      return '';
    }
    return value.split('')[0];
  }

  ngOnInit(): void {
    this.profile = this.authService.getProfile();
    if (this.profile) {
      this.isLoggedIn = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
