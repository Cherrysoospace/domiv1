import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * INTERFAZ DE CONFIGURACIÓN DEL MODAL
 */
export interface ModalConfig {
  title: string;              // Título del modal
  message: string;            // Mensaje o contenido
  confirmText?: string;       // Texto del botón confirmar (default: 'Aceptar')
  cancelText?: string;        // Texto del botón cancelar (default: 'Cancelar')
  showCancel?: boolean;       // Mostrar botón cancelar (default: true)
  onConfirm?: () => void;     // Callback al confirmar
  onCancel?: () => void;      // Callback al cancelar
}

/**
 * INTERFAZ DEL ESTADO DEL MODAL
 */
interface ModalState {
  isVisible: boolean;
  config?: ModalConfig;
}

/**
 * SERVICIO MODAL GLOBAL
 * 
 * Propósito: Gestionar modales desde cualquier componente de forma centralizada
 * Patrón: BehaviorSubject para controlar estado y configuración
 * 
 * EJEMPLOS DE USO:
 * 
 * // Inyectar en cualquier componente:
 * constructor(private modalService: ModalService) {}
 * 
 * // 1. Modal de confirmación (con callback)
 * eliminarUsuario(id: number) {
 *   this.modalService.confirm(
 *     'Confirmar eliminación',
 *     '¿Estás seguro de eliminar este usuario?',
 *     () => {
 *       this.http.delete(`/api/users/${id}`).subscribe(
 *         () => this.alertService.success('Usuario eliminado'),
 *         () => this.alertService.error('Error al eliminar')
 *       );
 *     }
 *   );
 * }
 * 
 * // 2. Modal informativo (solo OK)
 * this.modalService.info(
 *   'Información',
 *   'Tu perfil ha sido actualizado correctamente'
 * );
 * 
 * // 3. Modal de advertencia
 * this.modalService.warning(
 *   'Sesión por expirar',
 *   'Tu sesión expirará en 5 minutos'
 * );
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  
  // Estado privado del modal
  private modalSubject = new BehaviorSubject<ModalState>({
    isVisible: false
  });

  constructor() {}

  /**
   * Observable para que el componente modal se suscriba
   */
  getModalState(): Observable<ModalState> {
    return this.modalSubject.asObservable();
  }

  /**
   * Muestra un modal personalizado
   * @param config Configuración del modal
   */
  show(config: ModalConfig): void {
    this.modalSubject.next({
      isVisible: true,
      config
    });
  }

  /**
   * Modal de confirmación (con botones Sí/No o Aceptar/Cancelar)
   * @param title Título del modal
   * @param message Mensaje de confirmación
   * @param onConfirm Callback al confirmar
   * @param onCancel Callback al cancelar (opcional)
   */
  confirm(
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    this.show({
      title,
      message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showCancel: true,
      onConfirm,
      onCancel
    });
  }

  /**
   * Modal informativo (solo botón Aceptar)
   * @param title Título del modal
   * @param message Mensaje informativo
   */
  info(title: string, message: string): void {
    this.show({
      title,
      message,
      confirmText: 'Aceptar',
      showCancel: false
    });
  }

  /**
   * Modal de advertencia
   * @param title Título del modal
   * @param message Mensaje de advertencia
   */
  warning(title: string, message: string): void {
    this.show({
      title,
      message,
      confirmText: 'Entendido',
      showCancel: false
    });
  }

  /**
   * Cierra el modal actual
   */
  close(): void {
    this.modalSubject.next({
      isVisible: false
    });
  }
}
