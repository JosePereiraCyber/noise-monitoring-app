import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private http: HttpClient, private router: Router) {}

  onLoginSubmit(credentials: { email: string; password: string }) {
    this.http.post('https://your-secure-api.com/login', credentials, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          this.router.navigate(['/secure-api']); // Redireciona para a página segura
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }
}

export { LoginComponent };
