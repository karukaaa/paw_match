import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NYTResponse } from '../interfaces/newsInterfaces';
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
}
