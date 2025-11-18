import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Address } from 'src/app/models/address/address.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private baseUrl = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) { }

  private toAddress(raw: any): Address {
    // map backend object to Address and convert created_at to Date
    return {
      id: raw.id,
      order_id: raw.order_id,
      street: raw.street,
      city: raw.city,
      state: raw.state,
      postal_code: raw.postal_code,
      additional_info: raw.additional_info ?? null,
      // convert ISO string to Date object for easier manipulation in components
      created_at: raw.created_at ? new Date(raw.created_at).toISOString() : undefined
    } as Address;
  }

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toAddress(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toAddress(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Address>): Observable<Address> {
    // allow partial payloads (order_id may be optional in UI flows)
    return this.http.post<Address>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toAddress(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toAddress(raw)),
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
      // client-side / network error
      message = error.error.message;
    } else {
      // backend returned an unsuccessful response code
      message = error.error?.message || error.statusText || `HTTP ${error.status}`;
    }
    return throwError(() => new Error(message));
  }
}
