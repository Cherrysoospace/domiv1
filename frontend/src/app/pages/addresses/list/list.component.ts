import { Component, OnInit } from '@angular/core';
import { AddressesService } from 'src/app/services/address/addresses.service';
import { Address } from 'src/app/models/address/address.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  addresses: Address[] = [];

  constructor(private service: AddressesService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.addresses = res);
  }

  delete(id: number): void {
    if (confirm("¿Seguro que desea eliminar esta dirección?")) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
