import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

/**
 * Interceptor HTTP que añade automáticamente el token de Firebase
 * a TODAS las peticiones HTTP que haga tu aplicación
 * 
 * IMPORTANTE: Este interceptor es donde verás el token en:
 * DevTools → Network → Selecciona cualquier request → Headers → Authorization
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  /**
   * Intercepta TODAS las peticiones HTTP antes de enviarlas
   * @param req La petición HTTP original
   * @param next El siguiente handler en la cadena
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo añadimos el token a peticiones hacia tu API backend
    // Evitamos añadirlo a peticiones externas (Google, Firebase, etc.)
    if (this.shouldAddToken(req.url)) {
      // Convertimos la Promise del token en Observable
      return from(this.authService.getIdToken()).pipe(
        switchMap(token => {
          if (token) {
            // Clonamos la petición y añadimos el header Authorization
            // Este es el header que verás en DevTools → Network
            const clonedRequest = req.clone({
              setHeaders: {
                // Formato estándar Bearer Token
                Authorization: `Bearer ${token}`
              }
            });
            
            console.log('🚀 Petición interceptada:', req.url);
            console.log('🔑 Token añadido al header:', token.substring(0, 50) + '...');
            
            return next.handle(clonedRequest);
          }
          // Sin token, enviamos la petición original
          return next.handle(req);
        })
      );
    }
    
    // Peticiones externas van sin modificar
    return next.handle(req);
  }

  /**
   * Determina si debemos añadir el token a esta URL
   * Solo lo hacemos para peticiones a tu backend
   */
  private shouldAddToken(url: string): boolean {
    // Añade el token solo a peticiones que vayan a tu API
    // Modifica estas condiciones según tus necesidades
    return url.includes('localhost:5000') || 
           url.includes('/api/') ||
           url.includes('tu-dominio.com');
  }
}
