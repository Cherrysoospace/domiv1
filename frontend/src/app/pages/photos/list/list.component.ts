import { Component, OnInit } from '@angular/core';
import { PhotosService } from 'src/app/services/photo/photos.service';
import { Photo } from 'src/app/models/photo/photo.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  photos: Photo[] = [];

  constructor(private service: PhotosService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.photos = res);
  }

  delete(id: number): void {
    if (confirm('¿Seguro que desea eliminar esta foto?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

  getImageUrl(photo: Photo): string {
    // El backend retorna la imagen en /photos/<id>
    return `${environment.apiUrl}/photos/${photo.id}`;
  }

}
