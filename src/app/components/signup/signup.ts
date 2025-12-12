import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router, private firestore: Firestore) {}

  // ---------------------------
  // 1) VALIDATION ONLY (sync)
  // ---------------------------
  validateForm(): string | null {
    const emailError = this.validateEmail(this.email);
    if (emailError) return emailError;

    const pwError = this.validatePassword(this.password);
    if (pwError) return pwError;

    if (this.password !== this.confirmPassword) {
      return "Passwords don't match.";
    }

    return null; // all good
  }

  // ---------------------------
  // 2) FIREBASE + FIRESTORE (async)
  // ---------------------------
  private async performSignup() {
    const cred = await firstValueFrom(this.auth.signUp(this.email, this.password));

    const uid = cred.user.uid;

    await setDoc(doc(this.firestore, `users/${uid}`), {
      email: this.email,
      createdAt: new Date().toISOString(),
      favorites: [],
    });

    return cred;
  }

  // ---------------------------
  // 3) MAIN SUBMIT HANDLER
  // ---------------------------
  async submitForm() {
    this.error = null;

    // RUN VALIDATION FIRST (synchronous)
    const validationError = this.validateForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    // THEN RUN ASYNC SIGNUP
    this.loading = true;

    try {
      await this.performSignup();
      this.router.navigate(['/profile']);
    } catch (err: any) {
      console.error(err);
      this.error = err?.message || 'Signup failed';
    } finally {
      this.loading = false;
    }
  }

  // ---------------------------
  // Helper validation functions
  // ---------------------------
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
