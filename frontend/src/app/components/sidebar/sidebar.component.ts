import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

// 🏍️ MENÚ DE NAVEGACIÓN - PLATAFORMA DE DELIVERY
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2', class: '' },
    { path: '/restaurants', title: 'Restaurantes', icon: 'ni-shop', class: '' },
    { path: '/products', title: 'Productos', icon: 'ni-basket', class: '' },
    { path: '/menus', title: 'Menús', icon: 'ni-book-bookmark', class: '' },
    { path: '/orders', title: 'Pedidos', icon: 'ni-cart', class: '' },
    { path: '/customers', title: 'Clientes', icon: 'ni-badge', class: '' },
    { path: '/motorcycles', title: 'Motocicletas', icon: 'ni-delivery-fast', class: '' },
    { path: '/drivers', title: 'Conductores', icon: 'ni-circle-08', class: '' },
    { path: '/shifts', title: 'Turnos', icon: 'ni-time-alarm', class: '' },
    { path: '/addresses', title: 'Direcciones', icon: 'ni-pin-3', class: '' },
    { path: '/issues', title: 'Incidentes', icon: 'ni-notification-70', class: '' },
    { path: '/photos', title: 'Fotos', icon: 'ni-image', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  // 🔐 Probar conexión con backend y token
  async testBackendConnection() {
    try {
      const token = await this.authService.getIdToken();
      
      if (!token) {
        this.alertService.warning('No hay token disponible');
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      console.log('🔑 Token enviado:', token.substring(0, 50) + '...');

      this.http.get('http://localhost:5000/api/orders', { headers }).subscribe({
        next: (response) => {
          console.log('✅ Conexión exitosa con backend:', response);
          this.alertService.success('Conexión exitosa con el backend');
        },
        error: (error) => {
          console.error('❌ Error en conexión:', error);
          this.alertService.error(`Error: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      this.alertService.error('Error obteniendo token');
    }
  }
}
