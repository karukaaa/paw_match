import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewsArticle } from '../../interfaces/newsInterfaces';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './news-card.html',
  styleUrl: './news-card.css',
})
export class NewsCard {
  @Input() article!: NewsArticle;

  constructor(private router: Router, private fav: FavoritesService) {}

  openDetails() {
    this.router.navigate(['/news', this.article._id]);
  }

  isFavorite() {
    return this.article ? this.fav.isFavorite(this.article._id) : false;
  }

  toggleFavorite() {
    if (!this.article) return;

    this.fav.toggleFavorite(this.article._id);
  }
}
