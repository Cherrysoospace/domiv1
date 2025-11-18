import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Restaurant } from 'src/app/models/restaurant/restaurant.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  private baseUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) { }

  private toRestaurant(raw: any): Restaurant {
    return {
      id: raw.id,
      name: raw.name,
      address: raw.address,
      phone: raw.phone,
      email: raw.email ?? null,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      ...raw
    } as Restaurant;
  }

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toRestaurant(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toRestaurant(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toRestaurant(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toRestaurant(raw)),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Unknown error';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      message = error.error?.message || error.statusText || `HTTP ${error.status}`;
    }
    return throwError(() => new Error(message));
  }
}
