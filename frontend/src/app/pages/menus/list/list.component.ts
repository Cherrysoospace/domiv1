import { Component, OnInit } from '@angular/core';
import { MenusService } from 'src/app/services/menu/menus.service';
import { Menu } from 'src/app/models/menu/menu.model';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
  ,
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  menus: Menu[] = [];

  constructor(private service: MenusService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.menus = res);
  }

  delete(id: number) {
    if (confirm("¿Seguro que desea eliminar este menú?")) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
