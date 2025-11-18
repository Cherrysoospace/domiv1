import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from 'src/app/models/product/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  private toProduct(raw: any): Product {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description ?? null,
      price: raw.price,
      category: raw.category ?? null,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      ...raw
    } as Product;
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toProduct(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toProduct(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toProduct(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toProduct(raw)),
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
