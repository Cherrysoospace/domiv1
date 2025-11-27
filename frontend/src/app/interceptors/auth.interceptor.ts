import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP que añade automáticamente el token de Firebase
 * a TODAS las peticiones HTTP hacia el backend
 * 
 * IMPORTANTE: Este interceptor es donde verás el token en:
 * DevTools → Network → Selecciona cualquier request → Headers → Authorization: Bearer [token]
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Intercepta TODAS las peticiones HTTP antes de enviarlas
   * @param req La petición HTTP original
   * @param next El siguiente handler en la cadena
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo añadimos el token a peticiones hacia el backend
    // Excluimos Firebase, Google y otras APIs externas
    if (this.shouldAddToken(req.url)) {
      // Convertimos la Promise del token en Observable
      return from(this.authService.getIdToken()).pipe(
        switchMap(token => {
          if (token) {
            // Clonamos la petición y añadimos el header Authorization
            const clonedRequest = req.clone({
              setHeaders: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('═══════════════════════════════════════════════');
            console.log('🚀 PETICIÓN HTTP INTERCEPTADA');
            console.log('═══════════════════════════════════════════════');
            console.log('📍 URL:', req.url);
            console.log('📝 Método:', req.method);
            console.log('🔑 Token (primeros 50 chars):', token.substring(0, 50) + '...');
            console.log('📋 Headers completos:', {
              Authorization: `Bearer ${token.substring(0, 20)}...`,
              'Content-Type': 'application/json'
            });
            console.log('═══════════════════════════════════════════════');
            
            return next.handle(clonedRequest).pipe(
              catchError((error: HttpErrorResponse) => {
                // Manejo de errores HTTP
                if (error.status === 401) {
                  console.error('❌ Error 401: No autorizado - Token inválido o expirado');
                }
                if (error.status === 403) {
                  console.error('❌ Error 403: Prohibido - No tienes permisos');
                }
                return throwError(() => error);
              })
            );
          }
          
          console.warn('⚠️ No hay token disponible, enviando petición sin Authorization');
          // Sin token, enviamos la petición original
          return next.handle(req);
        })
      );
    }
    
    // Peticiones externas van sin modificar
    console.log('🌐 Petición externa (sin token):', req.url);
    return next.handle(req);
  }

  /**
   * Determina si debemos añadir el token a esta URL
   * Solo lo hacemos para peticiones hacia el backend Flask
   */
  private shouldAddToken(url: string): boolean {
    // Excluimos URLs de Firebase, Google y otras APIs externas
    const excludedDomains = [
      'firebase',
      'google',
      'googleapis',
      'gstatic',
      'microsoft',
      'github'
    ];
    
    // Si contiene algún dominio excluido, NO añadir token
    if (excludedDomains.some(domain => url.includes(domain))) {
      return false;
    }
    
    // Añadir token a peticiones hacia el backend local
    return url.includes('localhost:5000') || 
           url.includes('127.0.0.1:5000');
  }
}
