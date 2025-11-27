import { Component, OnInit } from '@angular/core';
import { AlertService, Alert } from '../../services/alert/alert.service';

/**
 * COMPONENTE DE ALERTAS/TOASTS
 * 
 * Propósito: Mostrar notificaciones emergentes al usuario
 * Tipos: success (verde), error (rojo), warning (amarillo), info (azul)
 * 
 * Uso desde cualquier componente:
 * constructor(private alertService: AlertService) {}
 * 
 * this.alertService.success('Operación exitosa');
 * this.alertService.error('Ocurrió un error');
 * this.alertService.warning('Advertencia importante');
 * this.alertService.info('Información relevante');
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  
  // Array de alertas activas que se mostrarán en pantalla
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio para recibir nuevas alertas
    this.alertService.getAlerts().subscribe(alert => {
      if (alert) {
        this.alerts.push(alert);
        
        // Auto-cerrar la alerta después de 5 segundos
        setTimeout(() => {
          this.removeAlert(alert);
        }, 5000);
      }
    });
  }

  /**
   * Cierra una alerta específica
   * @param alert La alerta a cerrar
   */
  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
  }

  /**
   * Obtiene el ícono según el tipo de alerta
   * @param type Tipo de alerta
   */
  getIcon(type: string): string {
    const icons: any = {
      success: 'ni ni-check-bold',
      error: 'ni ni-fat-remove',
      warning: 'ni ni-bell-55',
      info: 'ni ni-notification-70'
    };
    return icons[type] || 'ni ni-notification-70';
  }
}
