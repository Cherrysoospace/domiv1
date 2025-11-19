import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customer/customers.service';
import { Customer } from 'src/app/models/customer/customer.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private service: CustomersService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.customers = res);
  }

  delete(id: number): void {
    if (confirm('¿Seguro que desea eliminar este cliente?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

}
