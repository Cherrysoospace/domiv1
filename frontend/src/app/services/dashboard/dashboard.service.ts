import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private base = environment.mockServerUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) { }

  // Series temporales
  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sales`);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/orders`);
  }

  getOrdersByHour(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/orders_by_hour?date=${encodeURIComponent(date)}`);
  }

  // Barras / catálogo
  getProductCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/product_categories`);
  }

  getMotorcycles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/motorcycles`);
  }

  getMotorcycleStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/motorcycle_states`);
  }
}
