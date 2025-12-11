import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NewsArticle } from '../../interfaces/newsInterfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, DatePipe],
  templateUrl: './news-card.html',
  styleUrl: './news-card.css',
})
export class NewsCard {
  @Input() article!: NewsArticle;

  constructor(private router: Router) {}

  openDetails() {
    this.router.navigate(['/news', this.article._id]);
  }
}
