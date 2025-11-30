import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PhotosService } from 'src/app/services/photo/photos.service';
import { IssuesService } from 'src/app/services/issue/issues.service';
import { Photo } from 'src/app/models/photo/photo.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  photo: Partial<Photo> = {};
  issues: any[] = [];
  isEdit = false;
  selectedFile: File | null = null;
  sanitizedImageUrl: SafeUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photosService: PhotosService,
    private issuesService: IssuesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.isEdit = !!id;

    if (this.isEdit) {
      this.photosService.getById(+id).subscribe({
        next: (photo) => {
          this.photo = { ...photo };
          this.photo.taken_at = photo.taken_at ? new Date(photo.taken_at).toISOString().slice(0, 16) : '';
          console.log('✅ Foto cargada para edición:', this.photo);
        },
        error: (err) => {
          console.error('❌ Error al cargar la foto:', err);
          alert('Error al cargar la foto: ' + err.message);
          this.router.navigate(['/photos']);
        }
      });
    }

    this.issuesService.getAll().subscribe(issues => this.issues = issues);
  }

  getImageUrl(): string {
    // Construir URL completa para mostrar la imagen desde el backend
    if (this.isEdit && this.photo.id) {
      return `http://localhost:5000/photos/${this.photo.id}`;
    }
    return '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  save(): void {
    // Validar que issue_id esté seleccionado
    if (!this.photo.issue_id) {
      alert('Por favor selecciona un Issue');
      return;
    }

    // Validar que caption no esté vacío
    if (!this.photo.caption || this.photo.caption.trim() === '') {
      alert('Por favor ingresa un caption');
      return;
    }

    if (this.isEdit && this.selectedFile) {
      // CASO ESPECIAL: Edición con nueva imagen
      // El backend no soporta actualizar imagen por PUT, así que:
      // 1. Creamos nueva foto con la nueva imagen
      // 2. Eliminamos la foto anterior
      
      if (!confirm('¿Deseas reemplazar la imagen actual? Esto creará una nueva entrada.')) {
        return;
      }

      const payload: any = {
        issue_id: String(this.photo.issue_id),
        caption: this.photo.caption.trim()
      };

      if (this.photo.taken_at) {
        payload.taken_at = new Date(this.photo.taken_at).toISOString();
      }

      const oldPhotoId = this.photo.id!;

      // Crear nueva foto con la nueva imagen
      this.photosService.createWithFile(this.selectedFile, payload).subscribe({
        next: (newPhoto) => {
          console.log('✅ Nueva foto creada:', newPhoto);
          
          // Eliminar la foto anterior
          this.photosService.delete(oldPhotoId).subscribe({
            next: () => {
              console.log('✅ Foto anterior eliminada');
              alert('Imagen actualizada exitosamente');
              this.router.navigate(['/photos']);
            },
            error: (err) => {
              console.error('⚠️ Error al eliminar foto anterior:', err);
              alert('La nueva imagen se guardó, pero no se pudo eliminar la anterior. Por favor, elimínala manualmente.');
              this.router.navigate(['/photos']);
            }
          });
        },
        error: (err) => {
          console.error('❌ Error al crear nueva foto:', err);
          alert('Error al actualizar la imagen: ' + err.message);
        }
      });
    } else if (this.isEdit) {
      // MODO EDICIÓN SIN CAMBIAR IMAGEN (solo metadatos)
      const payload: any = {
        issue_id: Number(this.photo.issue_id),
        caption: this.photo.caption.trim(),
        taken_at: this.photo.taken_at ? new Date(this.photo.taken_at).toISOString() : null
      };
      
      this.photosService.update(this.photo.id!, payload).subscribe({
        next: (photo) => {
          console.log('✅ Foto actualizada exitosamente');
          this.router.navigate(['/photos']);
        },
        error: (err) => {
          console.error('❌ Error al actualizar la foto:', err);
          alert('Error al actualizar la foto: ' + err.message);
        }
      });
    } else {
      // MODO CREACIÓN
      if (!this.selectedFile) {
        alert('Por favor selecciona un archivo de imagen');
        return;
      }

      // Validar que el archivo tenga nombre
      if (!this.selectedFile.name || this.selectedFile.name.trim() === '') {
        alert('El archivo seleccionado no tiene nombre válido');
        return;
      }

      // Crear foto con archivo y metadatos en una sola llamada
      const payload: any = {
        issue_id: String(this.photo.issue_id),  // Enviar como string para FormData
        caption: this.photo.caption.trim()
      };

      // Solo agregar taken_at si existe
      if (this.photo.taken_at) {
        payload.taken_at = new Date(this.photo.taken_at).toISOString();
      }

      this.photosService.createWithFile(this.selectedFile, payload).subscribe({
        next: (photo) => {
          console.log('✅ Foto creada exitosamente');
          this.updateSanitizedImageUrl(photo.image_url);
          this.router.navigate(['/photos']);
        },
        error: (err) => {
          console.error('❌ Error al crear la foto:', err);
          alert('Error al crear la foto: ' + err.message);
        }
      });
    }
  }

  private updateSanitizedImageUrl(imageUrl: string | null): void {
    if (imageUrl) {
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    } else {
      this.sanitizedImageUrl = null;
    }
  }
}
