import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer/customer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

  private toCustomer(raw: any): Customer {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      // convert ISO string to Date object; if missing, use current date to satisfy type
      created_at: raw.created_at ? new Date(raw.created_at) : new Date()
    } as Customer;
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toCustomer(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toCustomer(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toCustomer(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toCustomer(raw)),
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
