import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DogApiService {
  private baseUrl = 'https://dogapi.dog/api/v2';

  constructor(private http: HttpClient) {}

  getRandomFact(): Observable<string> {
    return this.http
      .get<any>(`${this.baseUrl}/facts`)
      .pipe(map((res) => res?.data?.[0]?.attributes?.body || 'Dogs are amazing!'));
  }

  getBreeds(): Observable<{ name: string; description: string }[]> {
    return this.http.get<any>(`${this.baseUrl}/breeds`).pipe(
      map(
        (res) =>
          res?.data?.map((breed: any) => ({
            name: breed.attributes.name,
            description: breed.attributes.description,
          })) ?? []
      )
    );
  }
}
