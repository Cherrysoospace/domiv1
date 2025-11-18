import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Photo } from 'src/app/models/photo/photo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private baseUrl = `${environment.apiUrl}/photos`;

  constructor(private http: HttpClient) { }

  private toPhoto(raw: any): Photo {
    return {
      id: raw.id,
      issue_id: raw.issue_id,
      image_url: raw.image_url,
      caption: raw.caption ?? null,
      taken_at: raw.taken_at ? new Date(raw.taken_at) : undefined,
      created_at: raw.created_at ? new Date(raw.created_at) : undefined,
      ...raw
    } as Photo;
  }

  getAll(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl).pipe(
      map((arr: any[]) => arr.map(item => this.toPhoto(item))),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.toPhoto(raw)),
      catchError(this.handleError)
    );
  }

  // Create photo via JSON (if backend supports JSON creation)
  create(payload: Partial<Photo>): Observable<Photo> {
    return this.http.post<Photo>(this.baseUrl, payload).pipe(
      map((raw: any) => this.toPhoto(raw)),
      catchError(this.handleError)
    );
  }

  // Upload photo with file + form data to /photos/upload
  uploadWithFile(file: File, data: { [key: string]: any } = {}): Observable<Photo> {
    const form = new FormData();
    form.append('file', file, file.name);
    Object.keys(data).forEach(k => {
      if (data[k] !== undefined && data[k] !== null) {
        form.append(k, String(data[k]));
      }
    });

    return this.http.post<Photo>(`${this.baseUrl}/upload`, form).pipe(
      map((raw: any) => this.toPhoto(raw)),
      catchError(this.handleError)
    );
  }

  update(id: number, payload: Partial<Photo>): Observable<Photo> {
    return this.http.put<Photo>(`${this.baseUrl}/${id}`, payload).pipe(
      map((raw: any) => this.toPhoto(raw)),
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
