import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

/**
 * INTERFAZ DE ALERTA
 * Define la estructura de una notificación
 */
export interface Alert {
  id: string;              // ID único generado automáticamente
  type: 'success' | 'error' | 'warning' | 'info';  // Tipo de alerta
  message: string;         // Mensaje a mostrar
  timestamp: Date;         // Fecha/hora de creación
}

/**
 * SERVICIO DE ALERTAS GLOBAL
 * 
 * Propósito: Gestionar notificaciones toast desde cualquier parte de la aplicación
 * Patrón: Observable/Subject para comunicación entre componentes
 * 
 * EJEMPLOS DE USO:
 * 
 * // En cualquier componente inyectar el servicio:
 * constructor(private alertService: AlertService) {}
 * 
 * // Notificación de éxito (verde)
 * this.alertService.success('Usuario creado correctamente');
 * 
 * // Notificación de error (roja)
 * this.alertService.error('No se pudo conectar con el servidor');
 * 
 * // Advertencia (amarilla)
 * this.alertService.warning('El token expirará pronto');
 * 
 * // Información (azul)
 * this.alertService.info('Nueva actualización disponible');
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  
  // Subject privado para emitir alertas
  private alertSubject = new Subject<Alert>();
  
  // Contador para generar IDs únicos
  private alertIdCounter = 0;

  constructor() {}

  /**
   * Observable público para que los componentes se suscriban
   */
  getAlerts(): Observable<Alert> {
    return this.alertSubject.asObservable();
  }

  /**
   * Muestra una alerta de éxito (verde)
   * @param message Mensaje a mostrar
   */
  success(message: string): void {
    this.showAlert('success', message);
  }

  /**
   * Muestra una alerta de error (roja)
   * @param message Mensaje a mostrar
   */
  error(message: string): void {
    this.showAlert('error', message);
  }

  /**
   * Muestra una alerta de advertencia (amarilla)
   * @param message Mensaje a mostrar
   */
  warning(message: string): void {
    this.showAlert('warning', message);
  }

  /**
   * Muestra una alerta informativa (azul)
   * @param message Mensaje a mostrar
   */
  info(message: string): void {
    this.showAlert('info', message);
  }

  /**
   * Método privado que crea y emite una alerta
   * @param type Tipo de alerta
   * @param message Mensaje a mostrar
   */
  private showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const alert: Alert = {
      id: `alert-${this.alertIdCounter++}`,
      type,
      message,
      timestamp: new Date()
    };
    
    // Emitimos la alerta a todos los suscriptores
    this.alertSubject.next(alert);
    
    console.log(`🔔 [${type.toUpperCase()}] ${message}`);
  }
}
