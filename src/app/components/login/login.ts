import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites-service';
import { firstValueFrom } from 'rxjs';

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

  constructor(private auth: AuthService, private router: Router, private fav: FavoritesService) {}

  submitForm() {
    this.error.set(null);
    this.loading.set(true);

    this.auth.login(this.email(), this.password()).subscribe({
      next: async (cred) => {
        const uid = cred.user.uid;

        // Merge local favorites
        const merged = await this.fav.mergeLocalWithServerFavorites(uid);
        if (merged) {
          alert('Your local favorites were merged with your account.');
        }

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
