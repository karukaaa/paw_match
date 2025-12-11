import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submitForm() {
    this.error.set(null);
    this.loading.set(true);

    this.auth.login(this.email(), this.password()).subscribe({
      next: (cred) => {
        console.log('Logged in:', cred.user);
        this.loading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (errMsg) => {
        this.loading.set(false);
        this.error.set(errMsg);
        this.password.set('');
      },
    });
  }
}
