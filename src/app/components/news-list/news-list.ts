import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  Subject,
  switchMap,
  startWith,
  map,
  distinctUntilChanged,
  catchError,
  finalize,
  of,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewsService } from '../../services/news-service';
import { NewsArticle, NYTResponse } from '../../interfaces/newsInterfaces';
import { sign } from 'crypto';
import { NewsCard } from '../news-card/news-card';
import { FavoritesService } from '../../services/favorites-service';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, NewsCard],
  standalone: true,
  templateUrl: './news-list.html',
  styleUrl: './news-list.css',
})
export class NewsList implements OnInit {
  news = signal<NewsArticle[]>([]);
  query = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  page = signal<number>(0);
  pageSize = signal<number>(10);
  totalHits = signal<number>(0);
  totalPages = signal<number>(0);

  search$ = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: NewsService,
    private fav: FavoritesService
  ) {
    this.fav.favoritesChanged.subscribe(() => {
      this.news.update((list) => [...list]);
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => ({
          query: params.get('q') ?? '',
          page: Number(params.get('page')) || 0,
        })),
        debounceTime(500),
        distinctUntilChanged((prev, curr) => prev.query === curr.query && prev.page === curr.page),
        tap(({ query, page }) => {
          this.loading.set(true);
          this.error.set(null);
          this.query.set(query);
          this.page.set(page);
        }),
        switchMap(({ query, page }) =>
          this.api.getNews(query, page).pipe(
            catchError(() => {
              this.error.set('Failed to load articles');
              return of({
                response: { docs: [], metadata: { hits: 0 } },
              });
            }),
            finalize(() => this.loading.set(false))
          )
        )
      )
      .subscribe((res) => {
        this.news.set(res.response.docs);

        const hits = res.response.metadata?.hits ?? 0;
        this.totalHits.set(hits);
        this.totalPages.set(Math.ceil(hits / 10));
      });
  }

  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: val || null,
        page: 0, // reset to first page on search
        pageSize: this.pageSize(),
      },
    });
  }

  refresh() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null, page: 0, pageSize: this.pageSize() },
    });
    this.search$.next('');
  }

  // Pagination navigation
  goToPage(p: number) {
    if (p < 0 || p > this.totalPages() - 1) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.query(),
        page: p,
        pageSize: this.pageSize(),
      },
    });
  }

  changePageSize(size: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.query(),
        page: 0,
        pageSize: size,
      },
    });
  }
}
