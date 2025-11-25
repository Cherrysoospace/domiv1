import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MenusService } from 'src/app/services/menu/menus.service';
import { RestaurantsService } from 'src/app/services/restaurant/restaurants.service';
import { ProductsService } from 'src/app/services/product/products.service';

import { Menu } from 'src/app/models/menu/menu.model';
import { Restaurant } from 'src/app/models/restaurant/restaurant.model';
import { Product } from 'src/app/models/product/product.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  restaurants: Restaurant[] = [];
  products: Product[] = [];

  availabilityOptions = [
    { label: 'Disponible', value: true },
    { label: 'No disponible', value: false }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: MenusService,
    private restaurantsService: RestaurantsService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      restaurant_id: ['', Validators.required],
      product_id: ['', Validators.required],
      price: [0, Validators.required],
      availability: [true],
    });

    // cargar selects
    this.restaurantsService.getAll().subscribe(res => this.restaurants = res);
    this.productsService.getAll().subscribe(res => this.products = res);

    // cargar datos si estamos editando
    if (this.id) {
      this.service.getById(this.id).subscribe((data: Menu) => {
        this.form.patchValue({
          restaurant_id: data.restaurant_id,
          product_id: data.product_id,
          price: data.price,
          availability: data.availability
        });
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/menus']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/menus']);
      });
    }
  }

  cancel() {
    // navigate back to list without saving
    this.router.navigate(['/menus']);
  }

}
