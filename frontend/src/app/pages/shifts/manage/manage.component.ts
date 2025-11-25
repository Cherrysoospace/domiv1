import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ShiftsService } from 'src/app/services/shift/shifts.service';
import { DriversService } from 'src/app/services/driver/drivers.service';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';

import { Shift } from 'src/app/models/shift/shift.model';
import { Driver } from 'src/app/models/driver/driver.model';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  drivers: Driver[] = [];
  motorcycles: Motorcycle[] = [];

  statusOptions = ['active', 'completed', 'cancelled'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: ShiftsService,
    private driversService: DriversService,
    private motorcyclesService: MotorcyclesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      driver_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: [''],
      status: ['active'],
    });

    // cargar selects
    this.driversService.getAll().subscribe(res => this.drivers = res);
    this.motorcyclesService.getAll().subscribe(res => this.motorcycles = res);

    // cargar datos si existe id
    if (this.id) {
      this.service.getById(this.id).subscribe((data: Shift) => {
        this.form.patchValue(data);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/shifts']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/shifts']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/shifts']);
  }

}
