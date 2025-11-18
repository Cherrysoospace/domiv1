import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Menu } from 'src/app/models/menu/menu.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  private baseUrl = `${environment.apiUrl}/menus`;

  constructor(private http: HttpClient) { }

  private toMenu(raw: any): Menu {
    return {
      id: raw.id,
      restaurant_id: raw.restaurant_id,
      product_id: raw.product_id,
      price: raw.price,
      availability: raw.availability ?? true,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      product: raw.product ?? undefined,
      restaurant: raw.restaurant ?? undefined,
      ...raw
    } as Menu;
  }

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toMenu(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toMenu(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Menu>): Observable<Menu> {
    return this.http.post<Menu>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toMenu(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Menu>): Observable<Menu> {
    return this.http.put<Menu>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toMenu(raw)),
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
