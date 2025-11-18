import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Shift } from 'src/app/models/shift/shift.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {
  private baseUrl = `${environment.apiUrl}/shifts`;

  constructor(private http: HttpClient) { }

  private toShift(raw: any): Shift {
    return {
      id: raw.id,
      driver_id: raw.driver_id,
      motorcycle_id: raw.motorcycle_id,
      start_time: raw.start_time ? new Date(raw.start_time) : undefined,
      end_time: raw.end_time ? new Date(raw.end_time) : undefined,
      status: raw.status,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      driver: raw.driver ?? undefined,
      motorcycle: raw.motorcycle ?? undefined,
      ...raw
    } as Shift;
  }

  getAll(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toShift(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toShift(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Shift>): Observable<Shift> {
    return this.http.post<Shift>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toShift(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Shift>): Observable<Shift> {
    return this.http.put<Shift>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toShift(raw)),
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
