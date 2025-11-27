import { Component, OnInit } from '@angular/core';
import { ModalService, ModalConfig } from '../../services/modal/modal.service';

/**
 * COMPONENTE MODAL GENÉRICO
 * 
 * Propósito: Mostrar ventanas modales para confirmaciones, formularios, mensajes, etc.
 * Características: Título, contenido, botones personalizables, cierre con ESC o click fuera
 * 
 * Uso desde cualquier componente:
 * 
 * constructor(private modalService: ModalService) {}
 * 
 * // Modal de confirmación
 * this.modalService.confirm(
 *   '¿Eliminar usuario?',
 *   '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.',
 *   () => {
 *     // Código cuando confirma
 *     console.log('Usuario eliminado');
 *   },
 *   () => {
 *     // Código cuando cancela (opcional)
 *     console.log('Cancelado');
 *   }
 * );
 * 
 * // Modal informativo
 * this.modalService.info(
 *   'Bienvenido',
 *   'Esta es tu primera vez en el sistema. Te recomendamos configurar tu perfil.'
 * );
 * 
 * // Modal personalizado
 * this.modalService.show({
 *   title: 'Título personalizado',
 *   message: 'Contenido del modal',
 *   confirmText: 'Aceptar',
 *   cancelText: 'Cancelar',
 *   showCancel: true,
 *   onConfirm: () => console.log('Confirmado'),
 *   onCancel: () => console.log('Cancelado')
 * });
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  
  // Estado y configuración del modal
  isVisible = false;
  config: ModalConfig = {
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    showCancel: true
  };

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio para mostrar/ocultar el modal
    this.modalService.getModalState().subscribe(state => {
      this.isVisible = state.isVisible;
      if (state.config) {
        this.config = { ...this.config, ...state.config };
      }
    });
  }

  /**
   * Maneja el click en el botón de confirmar
   */
  onConfirm(): void {
    if (this.config.onConfirm) {
      this.config.onConfirm();
    }
    this.close();
  }

  /**
   * Maneja el click en el botón de cancelar
   */
  onCancel(): void {
    if (this.config.onCancel) {
      this.config.onCancel();
    }
    this.close();
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.modalService.close();
  }

  /**
   * Cierra el modal si se hace click fuera de él
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
