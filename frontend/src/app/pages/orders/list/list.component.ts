import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/order/orders.service';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';
import { Order } from 'src/app/models/order/order.model';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  orders: Order[] = [];
  motorcycles: Motorcycle[] = [];

  constructor(
    private service: OrdersService,
    private motorcyclesService: MotorcyclesService
  ) { }

  ngOnInit(): void {
    this.loadMotorcycles();
    this.load();
  }

  loadMotorcycles(): void {
    this.motorcyclesService.getAll().subscribe(res => this.motorcycles = res);
  }

  load(): void {
    this.service.getAll().subscribe(res => this.orders = res);
  }

  getMotorcyclePlate(motorcycleId: number | null | undefined): string {
    if (!motorcycleId) return 'Sin asignar';
    const motorcycle = this.motorcycles.find(m => m.id === motorcycleId);
    return motorcycle?.license_plate || 'Moto #' + motorcycleId;
  }

  delete(id: number): void {
    if (confirm('¿Seguro que desea eliminar esta orden?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

}
