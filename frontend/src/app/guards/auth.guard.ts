import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Guard que protege rutas privadas
 * Solo permite el acceso si el usuario está autenticado
 * 
 * Uso en app.routing.ts:
 * { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica si el usuario puede acceder a la ruta
   * @param route La ruta a la que intenta acceder
   * @param state El estado actual del router
   * @returns true si puede acceder, false si no
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificamos si hay un usuario autenticado
    if (this.authService.isAuthenticated()) {
      console.log('✅ Guard: Acceso permitido');
      return true;
    }

    // Usuario no autenticado: redirigir al login
    console.log('❌ Guard: Acceso denegado, redirigiendo a login');
    this.router.navigate(['/login'], {
      // Guardamos la URL a la que intentó acceder para redirigir después del login
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
