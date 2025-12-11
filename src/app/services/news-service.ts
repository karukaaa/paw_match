import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { NewsArticle, NYTResponse } from '../interfaces/newsInterfaces';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private baseUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

  constructor(private http: HttpClient) {}

  getNews(query: string, page: number): Observable<NYTResponse> {
    const url = `${this.baseUrl}?q=${query}&page=${page}&api-key=${environment.apiKey}`;
    return this.http.get<NYTResponse>(url);
  }

  getArticleById(id: string): Observable<NewsArticle | null> {
    const url = `${this.baseUrl}?fq=_id:("${id}")&api-key=${environment.apiKey}`;

    return this.http.get<NYTResponse>(url).pipe(
      map((res) => res.response?.docs?.[0] ?? null),
      catchError((err) => {
        console.error('Error loading article by ID:', err);
        return of(null);
      })
    );
  }
}
