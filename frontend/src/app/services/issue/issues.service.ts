import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Issue } from 'src/app/models/issue/issue.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private baseUrl = `${environment.apiUrl}/issues`;

  constructor(private http: HttpClient) { }

  private toIssue(raw: any): Issue {
    return {
      id: raw.id,
      motorcycle_id: raw.motorcycle_id,
      description: raw.description,
      issue_type: raw.issue_type,
      date_reported: raw.date_reported ? new Date(raw.date_reported) : undefined,
      status: raw.status,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      photos: raw.photos ?? []
    } as Issue;
  }

  getAll(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toIssue(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toIssue(raw)),
      catchError(this.handleError)
    );
  }

  create(payload: Partial<Issue>): Observable<Issue> {
    return this.http.post<Issue>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toIssue(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Issue>): Observable<Issue> {
    return this.http.put<Issue>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toIssue(raw)),
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
