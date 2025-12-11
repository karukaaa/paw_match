import { Component, signal } from '@angular/core';
import { NewsArticle } from '../../interfaces/newsInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../services/news-service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css',
})
export class NewsDetails {
  article = signal<NewsArticle | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private api: NewsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loading.set(true);

      this.api.getArticleById(id).subscribe({
        next: (article) => {
          if (article) {
            this.article.set(article);
          } else {
            this.error.set('Article not found');
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('NewsDetails error:', err);
          this.error.set('Failed to load article');
          this.loading.set(false);
        },
      });
    }
  }

  back() {
    this.router.navigateByUrl('/news');
  }
}
