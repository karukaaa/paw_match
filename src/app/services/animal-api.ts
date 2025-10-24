import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, of, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnimalApi {
  private baseUrl = 'https://api.petfinder.com/v2/animals';
  private tokenUrl = 'https://api.petfinder.com/v2/oauth2/token';
  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  private getToken(): Observable<string> {
    if (this.accessToken) {
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
        map((res) => {
          this.accessToken = res.access_token;
          return this.accessToken!;
        })
      );
  }

  getAnimals(page: number = 1, limit: number = 100): Observable<{ animals: Animal[] }> {
    const params = { page: page.toString(), limit: limit.toString() };

    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        return this.http.get<{ animals: Animal[] }>(this.baseUrl, { headers, params });
      })
    );
  }
}

export interface Animal {
  id: number;
  name: string;
  description: string;
  type: string;
  age: string;
  gender: string;
  breeds: {
    primary: string;
    secondary?: string;
    mixed?: boolean;
  };
  contact: {
    address: {
      city: string;
      state: string;
    };
  };
  tags?: string[];
  attributes?: {
    spayed_neutered?: boolean;
    house_trained?: boolean;
    declawed?: boolean;
    special_needs?: boolean;
    shots_current?: boolean;
  };
  environment?: {
    children?: boolean | null;
    dogs?: boolean | null;
    cats?: boolean | null;
  };
  primary_photo_cropped?: {
    small?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
  photos?: Array<{
    small?: string;
    medium?: string;
    large?: string;
    full?: string;
  }>;
  url: string;
}
