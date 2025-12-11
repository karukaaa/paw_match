import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private LOCAL_KEY = 'favorites';

  constructor(private auth: AuthService) {}

  // --- LOCAL STORAGE MODE ---
  getLocalFavorites(): string[] {
    const raw = localStorage.getItem(this.LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  saveLocalFavorites(list: string[]) {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(list));
  }

  addLocalFavorite(id: string) {
    const list = this.getLocalFavorites();
    if (!list.includes(id)) {
      list.push(id);
      this.saveLocalFavorites(list);
    }
  }

  removeLocalFavorite(id: string) {
    const list = this.getLocalFavorites().filter((x) => x !== id);
    this.saveLocalFavorites(list);
  }

  isFavoriteLocal(id: string): boolean {
    return this.getLocalFavorites().includes(id);
  }
}
