import { Component, OnInit } from '@angular/core';
import { DriversService } from '../../../services/driver/drivers.service';
import { Driver } from '../../../models/driver/driver.model';

@Component({
  selector: 'app-drivers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  drivers: Driver[] = [];

  constructor(private service: DriversService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.drivers = res);
  }

  delete(id: number): void {
    if (confirm("¿Seguro que desea eliminar este conductor?")) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}

