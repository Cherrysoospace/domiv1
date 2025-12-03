import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressesService } from 'src/app/services/address/addresses.service';
import { OrdersService } from 'src/app/services/order/orders.service';
import { Address } from 'src/app/models/address/address.model';
import { Order } from 'src/app/models/order/order.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  orders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: AddressesService,
    private ordersService: OrdersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      order_id: ['', Validators.required],
      additional_info: ['']
    });

    // Cargar órdenes disponibles
    this.ordersService.getAll().subscribe(orders => {
      this.orders = orders;
    });

    if (this.id) {
      this.service.getById(this.id).subscribe((data: Address) => this.form.patchValue(data));
    }
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => this.router.navigate(['/addresses']));
    } else {
      this.service.create(this.form.value).subscribe(() => this.router.navigate(['/addresses']));
    }
  }

  cancel(): void {
    this.router.navigate(['/addresses']);
  }

}
