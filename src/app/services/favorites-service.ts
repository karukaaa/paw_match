import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private LOCAL_KEY = 'favorites';

  constructor(private firestore: Firestore) {}

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

  async mergeLocalWithServerFavorites(uid: string): Promise<string[] | null> {
    const localFavs = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (!localFavs.length) return null;

    // Read server favorites
    const userRef = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userRef);

    let serverFavs: string[] = [];
    if (snap.exists()) {
      serverFavs = snap.data()['favorites'] || [];
    }

    // Merge without duplicates
    const merged = Array.from(new Set([...serverFavs, ...localFavs]));

    // Save merged list back to Firestore
    await updateDoc(userRef, { favorites: merged });

    // Clear local favorites — they’re stored on the server now
    localStorage.removeItem('favorites');

    return merged; // return for UI
  }
}
