import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'src/app/services/order/orders.service';
import { CustomersService } from 'src/app/services/customer/customers.service';
import { MenusService } from 'src/app/services/menu/menus.service';
import { AddressesService } from 'src/app/services/address/addresses.service';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';
import { Order } from 'src/app/models/order/order.model';
import { Customer } from 'src/app/models/customer/customer.model';
import { Menu } from 'src/app/models/menu/menu.model';
import { Address } from 'src/app/models/address/address.model';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  
  customers: Customer[] = [];
  menus: Menu[] = [];
  addresses: Address[] = [];
  motorcycles: Motorcycle[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: OrdersService,
    private customersService: CustomersService,
    private menusService: MenusService,
    private addressesService: AddressesService,
    private motorcyclesService: MotorcyclesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      customer_id: ['', Validators.required],
      menu_id: ['', Validators.required],
      address_id: ['', Validators.required],
      motorcycle_id: [null],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.loadRelatedData();

    if (this.id) {
      this.service.getById(this.id).subscribe(data => {
        this.form.patchValue({
          customer_id: data.customer_id,
          menu_id: data.menu_id,
          address_id: data.address?.id || '',
          motorcycle_id: data.motorcycle_id || null,
          quantity: data.quantity
        });
      });
    }
  }

  loadRelatedData(): void {
    this.customersService.getAll().subscribe(res => this.customers = res);
    this.menusService.getAll().subscribe(res => this.menus = res);
    this.addressesService.getAll().subscribe(res => this.addresses = res);
    this.motorcyclesService.getAll().subscribe(res => this.motorcycles = res);
  }

  save(): void {
    if (this.form.invalid) return;

    const payload = {
      customer_id: this.form.value.customer_id,
      menu_id: this.form.value.menu_id,
      address_id: this.form.value.address_id,
      motorcycle_id: this.form.value.motorcycle_id || null,
      quantity: this.form.value.quantity
    };

    if (this.id) {
      this.service.update(this.id, payload).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    } else {
      this.service.create(payload).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }

}
