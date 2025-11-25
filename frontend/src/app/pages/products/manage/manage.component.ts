import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductsService } from 'src/app/services/product/products.service';
import { Product } from 'src/app/models/product/product.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      category: ['']
    });

    if (this.id) {
      this.service.getById(this.id).subscribe((data: Product) => {
        this.form.patchValue(data);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

}
