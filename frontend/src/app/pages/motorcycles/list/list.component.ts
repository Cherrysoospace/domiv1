import { Component, OnInit } from '@angular/core';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  motorcycles: Motorcycle[] = [];

  constructor(private service: MotorcyclesService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.motorcycles = res);
  }

  delete(id: number): void {
    if (confirm('¿Seguro que desea eliminar esta motocicleta?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

}
