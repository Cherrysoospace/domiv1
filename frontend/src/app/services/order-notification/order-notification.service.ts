import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { NOTIFICATION_SOUND } from '../../../assets/sounds/notification-sound';

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
  
  // Observable para que otros componentes se suscriban
  public newOrder$ = this.newOrderSubject.asObservable();

  constructor() {
    // Inicializar audio
    this.audio = new Audio(NOTIFICATION_SOUND);
    this.audio.volume = 0.8; // 80% de volumen
    
    // Simular llegada de nuevos pedidos cada 30 segundos (demo)
    this.startSimulation();
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
   * Simulación de nuevos pedidos (para demo)
   * En producción, esto vendría de WebSocket o polling al backend
   */
  private startSimulation(): void {
    const customers = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Sánchez'];
    const items = ['Pizza Hawaiana', 'Hamburguesa Doble', 'Sushi Variado', 'Tacos Mexicanos', 'Pasta Carbonara'];
    const streets = ['Calle 23 #45-67', 'Carrera 15 #32-10', 'Avenida 5 #78-23', 'Diagonal 8 #12-45', 'Transversal 3 #56-89'];

    // Simular nuevo pedido cada 30 segundos
    interval(30000).subscribe(() => {
      const randomOrder: NewOrderNotification = {
        orderId: Math.floor(Math.random() * 1000) + 1000,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        items: items[Math.floor(Math.random() * items.length)],
        address: streets[Math.floor(Math.random() * streets.length)],
        timestamp: new Date()
      };

      this.notifyNewOrder(randomOrder);
    });
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
