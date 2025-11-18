import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotorcyclesService {
  private baseUrl = `${environment.apiUrl}/motorcycles`;

  constructor(private http: HttpClient) { }

  private toMotorcycle(raw: any): Motorcycle {
    return {
      id: raw.id,
      license_plate: raw.license_plate,
      brand: raw.brand,
      year: raw.year,
      status: raw.status,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      ...raw
    } as Motorcycle;
  }

  getAll(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toMotorcycle(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toMotorcycle(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Motorcycle>): Observable<Motorcycle> {
    return this.http.post<Motorcycle>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toMotorcycle(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Motorcycle>): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toMotorcycle(raw)),
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
