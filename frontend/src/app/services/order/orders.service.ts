import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order } from 'src/app/models/order/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  private toOrder(raw: any): Order {
    return {
      id: raw.id,
      customer_id: raw.customer_id,
      menu_id: raw.menu_id,
      motorcycle_id: raw.motorcycle_id ?? null,
      quantity: raw.quantity,
      total_price: raw.total_price,
      status: raw.status,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      address: raw.address ?? undefined,
      customer: raw.customer ?? undefined,
      menu: raw.menu ?? undefined,
      motorcycle: raw.motorcycle ?? undefined,
      ...raw
    } as Order;
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toOrder(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toOrder(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toOrder(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toOrder(raw)),
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

