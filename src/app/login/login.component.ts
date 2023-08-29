import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  login(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe({
        next: (res) => {
          this.toastr.success(`${res.user.firstName} ${res.user.lastName} `, 'Welcome');
          this.router.navigate(['/vote']);
        },
        error: (error) => {
          console.error('Login error:', error);
        },
      });
    }
  }
}

interface ILoginResponse {
  access_token: string;
}
