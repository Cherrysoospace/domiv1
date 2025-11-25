import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurant/restaurants.service';
import { Restaurant } from 'src/app/models/restaurant/restaurant.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private service: RestaurantsService) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.restaurants = res);
  }

  delete(id: number): void {
    if (confirm('¿Seguro que desea eliminar este restaurante?')) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }

}
