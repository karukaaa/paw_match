import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnimalApi {
  private baseUrl = 'https://api.petfinder.com/v2/animals';
  private tokenUrl = 'https://api.petfinder.com/v2/oauth2/token';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private http: HttpClient) {}

  private getToken(): Observable<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      console.log(this.accessToken);
      return of(this.accessToken);
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', environment.petfinderClientId);
    body.set('client_secret', environment.petfinderClientSecret);

    return this.http
      .post<any>(this.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .pipe(
        switchMap((res) => {
          this.accessToken = res.access_token;
          this.tokenExpiry = Date.now() + res.expires_in * 1000;
          console.log(res.access_token);
          return of(res.access_token);
        })
      );
  }

  getAnimals(page: number = 1, limit: number = 100): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        const params = {
          page: page.toString(),
          limit: limit.toString(),
        };
        return this.http.get<any>(this.baseUrl, { headers, params });
      })
    );
  }
}
