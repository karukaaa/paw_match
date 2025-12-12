import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

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

  constructor(private auth: AuthService, private router: Router, private firestore: Firestore) {}

  async submitForm() {
    this.error.set(null);
    this.loading.set(true);

    try {
      const cred = await firstValueFrom(this.auth.signUp(this.email(), this.password()));

      const uid = cred.user.uid;

      await setDoc(doc(this.firestore, `users/${uid}`), {
        email: this.email(),
        createdAt: new Date().toISOString(),
        favorites: [],
      });

      this.router.navigate(['/profile']);
    } catch (error: any) {
      console.error(error);
      this.error.set(error.message || 'Signup failed');
    } finally {
      this.loading.set(false);
    }
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
