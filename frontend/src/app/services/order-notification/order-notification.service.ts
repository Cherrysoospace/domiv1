import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { NOTIFICATION_SOUND } from '../../../assets/sounds/notification-sound';
import { OrdersService } from '../order/orders.service';
import { Order } from 'src/app/models/order/order.model';

export interface NewOrderNotification {
  orderId: number;
  customerName: string;
  items: string;
  address: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderNotificationService {
  private audio: HTMLAudioElement;
  private newOrderSubject = new Subject<NewOrderNotification>();
  private notifiedOrderIds = new Set<number>(); // IDs de órdenes ya notificadas
  
  // Observable para que otros componentes se suscriban
  public newOrder$ = this.newOrderSubject.asObservable();

  constructor(private ordersService: OrdersService) {
    // Inicializar audio
    this.audio = new Audio(NOTIFICATION_SOUND);
    this.audio.volume = 0.8; // 80% de volumen
    
    // Cargar órdenes existentes para no notificarlas
    this.initializeNotifiedOrders();
    
    // Iniciar polling de nuevas órdenes cada 10 segundos
    this.startPolling();
  }

  /**
   * Reproducir sonido de notificación
   */
  playNotificationSound(): void {
    try {
      this.audio.currentTime = 0; // Reiniciar si ya está sonando
      this.audio.play().catch(error => {
        console.warn('⚠️ No se pudo reproducir el sonido:', error);
        // Algunos navegadores bloquean autoplay, requiere interacción del usuario
      });
    } catch (error) {
      console.error('❌ Error al reproducir sonido:', error);
    }
  }

  /**
   * Notificar nuevo pedido
   */
  notifyNewOrder(notification: NewOrderNotification): void {
    console.log('🔔 NUEVO PEDIDO RECIBIDO:', notification);
    
    // Reproducir sonido
    this.playNotificationSound();
    
    // Emitir evento para que los componentes reaccionen
    this.newOrderSubject.next(notification);
  }

  /**
   * Inicializar el conjunto de órdenes ya existentes
   * para no notificar órdenes anteriores
   */
  private initializeNotifiedOrders(): void {
    this.ordersService.getAll().subscribe(orders => {
      orders.forEach(order => {
        if (order.id) {
          this.notifiedOrderIds.add(order.id);
        }
      });
      console.log(`✅ Inicializadas ${this.notifiedOrderIds.size} órdenes existentes`);
    });
  }

  /**
   * Polling de nuevas órdenes del backend
   * Verifica cada 5 segundos si hay órdenes nuevas
   */
  private startPolling(): void {
    // Verificar nuevas órdenes cada 5 segundos
    interval(5000).subscribe(() => {
      this.checkForNewOrders();
    });
  }

  /**
   * Verificar si hay nuevas órdenes
   */
  private checkForNewOrders(): void {
    this.ordersService.getAll().subscribe(orders => {
      orders.forEach(order => {
        // Si la orden no ha sido notificada antes
        if (order.id && !this.notifiedOrderIds.has(order.id)) {
          this.notifiedOrderIds.add(order.id);
          
          // Crear notificación a partir de la orden real
          const notification: NewOrderNotification = {
            orderId: order.id,
            customerName: order.customer?.name || 'Cliente desconocido',
            items: this.getOrderItems(order),
            address: this.getOrderAddress(order),
            timestamp: order.created_at ? new Date(order.created_at) : new Date()
          };

          this.notifyNewOrder(notification);
        }
      });
    });
  }

  /**
   * Obtener descripción de items del pedido
   */
  private getOrderItems(order: Order): string {
    if (order.menu?.product?.name) {
      return `${order.menu.product.name} (x${order.quantity || 1})`;
    }
    return `Pedido #${order.id}`;
  }

  /**
   * Obtener dirección del pedido
   */
  private getOrderAddress(order: Order): string {
    if (order.address) {
      const parts = [];
      if (order.address.street) parts.push(order.address.street);
      if (order.address.city) parts.push(order.address.city);
      return parts.join(', ') || 'Dirección no disponible';
    }
    return 'Dirección no disponible';
  }

  /**
   * Habilitar sonido (llamar después de interacción del usuario)
   */
  enableSound(): void {
    // Reproducir un sonido silencioso para desbloquear audio en el navegador
    const silentAudio = new Audio(NOTIFICATION_SOUND);
    silentAudio.volume = 0.01;
    silentAudio.play().then(() => {
      console.log('✅ Sonido habilitado');
    }).catch(() => {
      console.warn('⚠️ El usuario debe interactuar primero para habilitar el sonido');
    });
  }
}
