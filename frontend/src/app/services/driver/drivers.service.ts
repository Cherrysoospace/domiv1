import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Driver } from 'src/app/models/driver/driver.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private baseUrl = `${environment.apiUrl}/drivers`;

  constructor(private http: HttpClient) { }

  private toDriver(raw: any): Driver {
    return {
      id: raw.id,
      name: raw.name,
      license_number: raw.license_number,
      phone: raw.phone,
      email: raw.email ?? undefined,
      // backend may use different status strings; map conservatively
      status: (raw.status as any) || 'inactive',
      created_at: raw.created_at ? new Date(raw.created_at) : new Date()
    } as Driver;
  }

  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toDriver(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toDriver(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toDriver(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Driver>): Observable<Driver> {
    return this.http.put<Driver>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toDriver(raw)),
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
