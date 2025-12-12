import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth-service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private LOCAL_KEY = 'favorites';

  private serverFavorites: string[] = [];
  favoritesChanged = new Subject<void>();

  constructor(private auth: AuthService, private firestore: Firestore) {
    this.auth.authState$.subscribe((user) => {
      if (user) this.loadServerFavorites(user.uid);
    });
  }
  getFavorites(): string[] {
    const raw = localStorage.getItem(this.LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveFavorites(list: string[]) {
    localStorage.setItem(this.LOCAL_KEY, JSON.stringify(list));
  }

  isFavorite(id: string): boolean {
    const user = this.auth.currentUser;

    if (user) {
      return this.serverFavorites.includes(id);
    }

    return this.getFavorites().includes(id);
  }

  addFavorite(id: string) {
    const current = this.getFavorites();
    if (!current.includes(id)) {
      this.saveFavorites([...current, id]);
    }
  }

  removeFavorite(id: string) {
    const updated = this.getFavorites().filter((x) => x !== id);
    this.saveFavorites(updated);
  }

  async toggleFavorite(id: string) {
    const user = this.auth.currentUser;

    if (user) {
      if (this.serverFavorites.includes(id)) {
        this.serverFavorites = this.serverFavorites.filter((f) => f !== id);
      } else {
        this.serverFavorites.push(id);
      }

      const ref = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(ref, { favorites: this.serverFavorites });

      this.favoritesChanged.next();
      return;
    }

    let local = this.getFavorites();
    if (local.includes(id)) {
      local = local.filter((x) => x !== id);
    } else {
      local = [...local, id];
    }

    this.saveFavorites(local);
    this.favoritesChanged.next();
  }

  async mergeLocalWithServerFavorites(uid: string): Promise<string[] | null> {
    const localFavs = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (!localFavs.length) return null;

    const userRef = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(userRef);

    let serverFavs: string[] = [];
    if (snap.exists()) {
      serverFavs = snap.data()['favorites'] || [];
    }

    const merged = Array.from(new Set([...serverFavs, ...localFavs]));

    await updateDoc(userRef, { favorites: merged });
    localStorage.removeItem('favorites');

    this.serverFavorites = merged;
    this.favoritesChanged.next();

    return merged;
  }

  //Loading from Firestore Server
  async loadServerFavorites(uid: string) {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);

    this.serverFavorites = snap.exists() ? snap.data()['favorites'] || [] : [];

    this.favoritesChanged.next(); // <-- notify UI
  }

  getFavoritesFromServer(): string[] {
    return this.serverFavorites;
  }
}
