import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { OrdersService } from 'src/app/services/order/orders.service';
import { Order } from 'src/app/models/order/order.model';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface MotorcycleLocation {
  orderId: number;
  lat: number;
  lng: number;
  licensePlate: string;
  status: string;
  customerName: string;
  address: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  mapsLoaded = false;
  mapLoadError?: string;
  markerAnimation?: google.maps.Animation;
  private googleCheckIntervalId?: number;
  private googleCheckAttempts = 0;
  private readonly googleCheckMaxAttempts = 20;
  
  // Configuración del mapa
  center: google.maps.LatLngLiteral = { lat: 5.0689, lng: -75.5174 }; // Manizales, Colombia
  zoom = 13;
  
  // Marcadores de motos
  motorcycleLocations: MotorcycleLocation[] = [];
  
  // Opciones del mapa
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 18,
    minZoom: 10,
  };

  constructor(
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.ensureGoogleMapsAvailable();
    this.loadOrdersWithLocations();
    
    // Actualizar ubicaciones cada 10 segundos (simulación de tiempo real)
    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMotorcycleLocations();
      });
  }

  ngOnDestroy(): void {
    try {
      this.destroy$.next();
      this.destroy$.complete();
      
      if (this.googleCheckIntervalId) {
        window.clearInterval(this.googleCheckIntervalId);
        this.googleCheckIntervalId = undefined;
      }
    } catch (error) {
      console.warn('Error al destruir componente de mapa:', error);
    }
  }

  /**
   * Cargar pedidos activos y generar ubicaciones simuladas
   */
  loadOrdersWithLocations(): void {
    this.ordersService.getAll().subscribe(orders => {
      this.motorcycleLocations = orders
        .filter(order => order.motorcycle_id) // Solo pedidos con moto asignada
        .map(order => this.generateLocationForOrder(order));
    });
  }

  /**
   * Generar ubicación simulada para una orden
   * En producción, esto vendría del GPS de la moto
   */
  private generateLocationForOrder(order: Order): MotorcycleLocation {
    // Generar coordenadas aleatorias cerca de Manizales
    const lat = 5.0689 + (Math.random() - 0.5) * 0.05;
    const lng = -75.5174 + (Math.random() - 0.5) * 0.05;

    return {
      orderId: order.id,
      lat: lat,
      lng: lng,
      licensePlate: `Moto ${order.motorcycle_id}`,
      status: this.getOrderStatus(order.id),
      customerName: order.customer?.name || 'Cliente',
      address: order.address?.street || 'Dirección no disponible'
    };
  }

  /**
   * Obtener estado del pedido (simulado)
   */
  private getOrderStatus(orderId: number): string {
    const statuses = ['En preparación', 'En camino', 'Cerca del destino'];
    return statuses[orderId % statuses.length];
  }

  /**
   * Actualizar ubicaciones de motos (simular movimiento)
   */
  private updateMotorcycleLocations(): void {
    this.motorcycleLocations = this.motorcycleLocations.map(location => ({
      ...location,
      lat: location.lat + (Math.random() - 0.5) * 0.002, // Pequeño movimiento
      lng: location.lng + (Math.random() - 0.5) * 0.002
    }));
  }

  /**
   * Obtener icono según estado del pedido
   */
  getMarkerIcon(status: string): google.maps.Symbol {
    const colors: { [key: string]: string } = {
      'En preparación': '#FFA726', // Naranja
      'En camino': '#1E88E5',       // Azul
      'Cerca del destino': '#00ACC1' // Cyan
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: colors[status] || '#1E88E5',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    };
  }

  private ensureGoogleMapsAvailable(): void {
    try {
      if (this.googleMapsReady()) {
        this.onGoogleMapsReady();
        return;
      }

      this.googleCheckIntervalId = window.setInterval(() => {
        if (this.googleMapsReady()) {
          this.onGoogleMapsReady();
          return;
        }

        this.googleCheckAttempts++;

        if (this.googleCheckAttempts >= this.googleCheckMaxAttempts) {
          if (this.googleCheckIntervalId) {
            window.clearInterval(this.googleCheckIntervalId);
            this.googleCheckIntervalId = undefined;
          }
          this.mapLoadError = 'Google Maps no está disponible. Verifica que la API tenga facturación habilitada y que la clave esté autorizada.';
          this.cdr.detectChanges();
        }
      }, 500);
    } catch (error) {
      console.error('Error al inicializar Google Maps:', error);
      this.mapLoadError = 'Error al cargar Google Maps. Por favor, recarga la página.';
      this.cdr.detectChanges();
    }
  }

  private googleMapsReady(): boolean {
    return typeof google !== 'undefined' && !!google.maps;
  }

  private onGoogleMapsReady(): void {
    if (this.googleCheckIntervalId) {
      window.clearInterval(this.googleCheckIntervalId);
      this.googleCheckIntervalId = undefined;
    }
    
    // Usar NgZone para asegurar que Angular detecte los cambios
    this.ngZone.run(() => {
      this.mapLoadError = undefined;
      this.markerAnimation = google.maps.Animation.DROP;
      
      // Delay pequeño para asegurar que el DOM esté listo
      setTimeout(() => {
        this.mapsLoaded = true;
        this.cdr.detectChanges();
      }, 100);
    });
  }

  /**
   * Abrir ventana de información del marcador
   */
  openInfoWindow(location: MotorcycleLocation): void {
    console.log('📍 Información del pedido:', location);
  }
}
