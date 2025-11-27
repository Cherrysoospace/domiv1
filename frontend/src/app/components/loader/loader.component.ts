import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';

/**
 * COMPONENTE LOADER GLOBAL
 * 
 * Propósito: Mostrar un spinner de carga cuando se ejecutan operaciones asíncronas
 * Ubicación: Se muestra en el centro de la pantalla con overlay oscuro
 * 
 * Uso desde cualquier componente:
 * 
 * constructor(private loaderService: LoaderService) {}
 * 
 * // Mostrar loader
 * this.loaderService.show();
 * 
 * // Ocultar loader
 * this.loaderService.hide();
 * 
 * // Ejemplo con petición HTTP:
 * this.loaderService.show();
 * this.http.get('/api/data').subscribe(
 *   response => {
 *     this.loaderService.hide();
 *     // Procesar respuesta
 *   },
 *   error => {
 *     this.loaderService.hide();
 *     // Manejar error
 *   }
 * );
 */
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  
  // Variable que controla si se muestra o no el loader
  isLoading = false;

  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    // Nos suscribimos al servicio para mostrar/ocultar el loader
    this.loaderService.getLoaderState().subscribe(state => {
      this.isLoading = state;
    });
  }
}
