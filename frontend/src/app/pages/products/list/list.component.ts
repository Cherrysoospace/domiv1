import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/product/products.service';
import { Product } from 'src/app/models/product/product.model';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  products: Product[] = [];

  constructor(private service: ProductsService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.products = res);
  }

  delete(id: number) {
    if (confirm("¿Seguro que desea eliminar este producto?")) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
