import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { NewsService } from '../../services/news-service';
import { NewsCard } from '../news-card/news-card';
import { NewsArticle } from '../../interfaces/newsInterfaces';
import { firstValueFrom } from 'rxjs';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, NewsCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private auth = inject(AuthService);
  private firestore = inject(Firestore);
  private news = inject(NewsService);

  loading = signal(true);
  favorites = signal<NewsArticle[]>([]);
  user$ = this.auth.authState$;

  constructor(private fav: FavoritesService) {
    this.user$.subscribe((user) => {
      this.loadFavorites(user);
    });
    this.fav.favoritesChanged.subscribe(() => {
      const user = this.auth.currentUser;
      this.loadFavorites(user);
    });
  }

  async loadFavorites(user: any) {
    this.loading.set(true);
    this.favorites.set([]);

    let ids: string[] = [];

    if (user) {
      // Load Firestore favorites
      const ref = doc(this.firestore, `users/${user.uid}`);
      const snap = await getDoc(ref);
      ids = snap.exists() ? snap.data()['favorites'] || [] : [];
    } else {
      // Load localStorage favorites
      ids = JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    const articles: NewsArticle[] = [];

    for (const id of ids) {
      try {
        const article = await firstValueFrom(this.news.getArticleById(id));
        if (article) articles.push(article);
      } catch (err) {
        console.error(`Failed to load article for id ${id}`, err);
      }
    }

    this.favorites.set(articles);
    this.loading.set(false);
  }
}
