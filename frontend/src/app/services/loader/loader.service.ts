import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * SERVICIO LOADER GLOBAL
 * 
 * Propósito: Controlar la visibilidad del spinner de carga desde cualquier componente
 * Patrón: BehaviorSubject para mantener el estado actual del loader
 * 
 * EJEMPLOS DE USO:
 * 
 * // En cualquier componente:
 * constructor(private loaderService: LoaderService) {}
 * 
 * // Mostrar loader antes de una operación
 * this.loaderService.show();
 * 
 * // Ocultar loader después de completar
 * this.loaderService.hide();
 * 
 * // Ejemplo con async/await:
 * async guardarDatos() {
 *   this.loaderService.show();
 *   try {
 *     await this.api.save(data);
 *     this.alertService.success('Guardado correctamente');
 *   } catch (error) {
 *     this.alertService.error('Error al guardar');
 *   } finally {
 *     this.loaderService.hide();
 *   }
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  // BehaviorSubject que mantiene el estado actual (false = oculto, true = visible)
  private loaderSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * Observable para que los componentes se suscriban al estado del loader
   */
  getLoaderState(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }

  /**
   * Muestra el loader
   */
  show(): void {
    console.log('⏳ Loader: Mostrando spinner...');
    this.loaderSubject.next(true);
  }

  /**
   * Oculta el loader
   */
  hide(): void {
    console.log('✅ Loader: Ocultando spinner');
    this.loaderSubject.next(false);
  }

  /**
   * Obtiene el estado actual del loader sin suscribirse
   * @returns true si está visible, false si está oculto
   */
  isLoading(): boolean {
    return this.loaderSubject.value;
  }
}
