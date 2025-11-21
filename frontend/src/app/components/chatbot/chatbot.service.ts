/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  // environment should provide geminiApiKey and optional geminiUrl/model
  private apiKey = (environment as any).geminiApiKey || '';
  private geminiUrl = (environment as any).geminiUrl || 'https://generative.googleapis.com/v1beta2/models/gemini-1.0:generateText';

  constructor(private http: HttpClient) { }

  // Send a message to Gemini and return the text reply (best effort parsing)
  sendMessage(message: string): Observable<string> {
    if (!message || message.trim().length === 0) {
      return of('');
    }

    const body: any = {
      prompt: message,
      // some servers expect different names; keep minimal and let API adapt
      maxOutputTokens: 512
    };

    const headers: HttpHeaders = this.apiKey ? new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`
    }) : new HttpHeaders();

    // Try POST with JSON body. The exact Gemini contract varies; this is a pragmatic approach.
    return this.http.post<any>(this.geminiUrl, body, { headers }).pipe(
      map(resp => {
        // best-effort to extract text from a few known shapes
        if (!resp) return 'Lo siento, no recibí respuesta.';
        // google generative may return {candidates:[{output: '...'}]} or {candidates:[{content: '...'}]}
        if (resp.candidates && resp.candidates.length) {
          const c = resp.candidates[0];
          return c.output || c.content || c.text || JSON.stringify(c);
        }
        // some versions return {output:[{content:[{text:'...'}]}]}
        if (resp.output && resp.output.length) {
          try {
            const text = resp.output.map((o: any) => {
              if (o.content && o.content.length) {
                return o.content.map((c: any) => c.text || c).join('\n');
              }
              return o.text || JSON.stringify(o);
            }).join('\n');
            return text || JSON.stringify(resp);
          } catch (e) {
            return JSON.stringify(resp);
          }
        }
        // fallback: try a few fields
        return resp.output_text || resp.text || JSON.stringify(resp);
      }),
      catchError(err => {
        console.error('ChatbotService error', err);
        return of('Lo siento, ocurrió un error al obtener la respuesta.');
      })
    );
  }
}*/
