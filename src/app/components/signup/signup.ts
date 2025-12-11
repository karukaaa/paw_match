import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submitForm() {
    this.error.set(null);

    const emailError = this.validateEmail(this.email());
    if (emailError) {
      this.error.set(emailError);
      return;
    }

    const pwError = this.validatePassword(this.password());
    if (pwError) {
      this.error.set(pwError);
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.error.set("Passwords don't match.");
      return;
    }

    this.loading.set(true);

    this.auth.signUp(this.email(), this.password()).subscribe({
      next: (cred) => {
        console.log('Signed up:', cred.user);
        this.loading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (errMsg) => {
        this.loading.set(false);
        this.error.set(errMsg);
      },
    });
  }

  validateEmail(email: string): string | null {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : 'Invalid email format.';
  }

  validatePassword(pw: string): string | null {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[0-9]/.test(pw)) return 'Password must include at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
      return 'Password must include at least one special character.';
    return null;
  }
}
