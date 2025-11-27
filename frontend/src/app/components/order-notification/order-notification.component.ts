import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderNotificationService, NewOrderNotification } from 'src/app/services/order-notification/order-notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrls: ['./order-notification.component.scss']
})
export class OrderNotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  notifications: NewOrderNotification[] = [];
  showNotification = false;
  currentNotification: NewOrderNotification | null = null;

  constructor(private notificationService: OrderNotificationService) {}

  ngOnInit(): void {
    // Suscribirse a nuevos pedidos
    this.notificationService.newOrder$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notification => {
        this.addNotification(notification);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Agregar notificación a la lista y mostrarla
   */
  addNotification(notification: NewOrderNotification): void {
    this.notifications.unshift(notification);
    this.currentNotification = notification;
    this.showNotification = true;

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      this.hideNotification();
    }, 10000);
  }

  /**
   * Ocultar notificación actual
   */
  hideNotification(): void {
    this.showNotification = false;
    setTimeout(() => {
      this.currentNotification = null;
    }, 300); // Esperar animación
  }

  /**
   * Limpiar todas las notificaciones
   */
  clearNotifications(): void {
    this.notifications = [];
    this.hideNotification();
  }

  /**
   * Habilitar sonido (para navegadores que bloquean autoplay)
   */
  enableSound(): void {
    this.notificationService.enableSound();
  }
}
