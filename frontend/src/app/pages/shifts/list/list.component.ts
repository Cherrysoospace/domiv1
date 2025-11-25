import { Component, OnInit } from '@angular/core';
import { ShiftsService } from 'src/app/services/shift/shifts.service';
import { Shift } from 'src/app/models/shift/shift.model';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  shifts: Shift[] = [];

  constructor(private service: ShiftsService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.shifts = res);
  }

  delete(id: number) {
    if (confirm("¿Seguro que desea eliminar este turno?")) {
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}


