import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private LOCAL_KEY = 'favorites';

  // Read favorites from localStorage
  getFavorites(): string[] {
    const raw = localStorage.getItem(this.LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  // Save updated list
  private saveFavorites(list: string[]) {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(list));
  }

  // Check if ID is already favorited
  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  }

  // Add favorite
  addFavorite(id: string) {
    const current = this.getFavorites();
    if (!current.includes(id)) {
      this.saveFavorites([...current, id]);
    }
  }

  // Remove favorite
  removeFavorite(id: string) {
    const updated = this.getFavorites().filter((x) => x !== id);
    this.saveFavorites(updated);
  }

  // Toggle helper (optional)
  toggleFavorite(id: string) {
    this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
  }
}
