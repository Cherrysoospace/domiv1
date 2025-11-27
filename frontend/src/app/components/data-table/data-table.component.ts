import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * INTERFAZ PARA COLUMNAS DE LA TABLA
 */
export interface TableColumn {
  field: string;        // Nombre del campo en los datos (ej: 'name', 'email')
  header: string;       // Título que se muestra en el header (ej: 'Nombre', 'Correo')
  sortable?: boolean;   // Si la columna es ordenable (default: true)
}

/**
 * COMPONENTE DATA TABLE REUTILIZABLE
 * 
 * Propósito: Tabla genérica con paginación, búsqueda y ordenamiento
 * 
 * EJEMPLO DE USO:
 * 
 * <!-- En tu componente HTML -->
 * <app-data-table
 *   [data]="usuarios"
 *   [columns]="columnasUsuarios"
 *   [itemsPerPage]="10"
 *   [searchPlaceholder]="'Buscar usuarios...'"
 *   (onEdit)="editarUsuario($event)"
 *   (onDelete)="eliminarUsuario($event)">
 * </app-data-table>
 * 
 * // En tu componente TypeScript:
 * usuarios = [
 *   { id: 1, name: 'Juan Pérez', email: 'juan@mail.com', role: 'Admin' },
 *   { id: 2, name: 'María García', email: 'maria@mail.com', role: 'User' }
 * ];
 * 
 * columnasUsuarios: TableColumn[] = [
 *   { field: 'id', header: 'ID', sortable: true },
 *   { field: 'name', header: 'Nombre', sortable: true },
 *   { field: 'email', header: 'Email', sortable: true },
 *   { field: 'role', header: 'Rol', sortable: false }
 * ];
 * 
 * editarUsuario(usuario: any) {
 *   console.log('Editar:', usuario);
 * }
 * 
 * eliminarUsuario(usuario: any) {
 *   this.modalService.confirm(
 *     'Confirmar',
 *     `¿Eliminar a ${usuario.name}?`,
 *     () => this.http.delete(`/api/users/${usuario.id}`).subscribe()
 *   );
 * }
 */
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  
  // INPUTS: Datos que recibe el componente desde el padre
  @Input() data: any[] = [];                    // Array de datos a mostrar
  @Input() columns: TableColumn[] = [];         // Definición de columnas
  @Input() itemsPerPage = 10;                   // Registros por página
  @Input() searchPlaceholder = 'Buscar...';     // Texto del input de búsqueda
  @Input() showActions = true;                  // Mostrar columna de acciones (editar/eliminar)
  
  // OUTPUTS: Eventos que emite el componente hacia el padre
  @Output() onEdit = new EventEmitter<any>();   // Se dispara al hacer click en Editar
  @Output() onDelete = new EventEmitter<any>(); // Se dispara al hacer click en Eliminar

  // Variables internas
  filteredData: any[] = [];      // Datos después de aplicar búsqueda
  paginatedData: any[] = [];     // Datos de la página actual
  searchTerm = '';               // Término de búsqueda actual
  currentPage = 1;               // Página actual
  totalPages = 1;                // Total de páginas
  sortColumn = '';               // Columna por la que se está ordenando
  sortDirection: 'asc' | 'desc' = 'asc';  // Dirección del ordenamiento

  ngOnInit(): void {
    this.updateTable();
  }

  /**
   * Actualiza la tabla completa (filtrado, ordenamiento y paginación)
   */
  private updateTable(): void {
    // 1. Aplicar búsqueda
    this.applySearch();
    
    // 2. Calcular paginación
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    
    // 3. Obtener datos de la página actual
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  /**
   * Aplica el filtro de búsqueda
   */
  applySearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item => {
      // Busca en todos los campos definidos en las columnas
      return this.columns.some(col => {
        const value = item[col.field];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }

  /**
   * Maneja el cambio en el input de búsqueda
   */
  onSearchChange(): void {
    this.currentPage = 1;  // Volver a la primera página
    this.updateTable();
  }

  /**
   * Ordena los datos por una columna
   */
  sortBy(column: TableColumn): void {
    if (!column.sortable) return;

    // Si es la misma columna, cambiar dirección
    if (this.sortColumn === column.field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.field;
      this.sortDirection = 'asc';
    }

    // Ordenar datos
    this.filteredData.sort((a, b) => {
      const valueA = a[column.field];
      const valueB = b[column.field];

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateTable();
  }

  /**
   * Navega a una página específica
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateTable();
  }

  /**
   * Emite evento de edición
   */
  edit(item: any): void {
    this.onEdit.emit(item);
  }

  /**
   * Emite evento de eliminación
   */
  delete(item: any): void {
    this.onDelete.emit(item);
  }

  /**
   * Genera el array de números de página para la paginación
   */
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
