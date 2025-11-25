import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DriversService } from 'src/app/services/driver/drivers.service';
import { Driver } from 'src/app/models/driver/driver.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  statusOptions = ['available', 'on_shift', 'unavailable'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: DriversService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      name: ['', Validators.required],
      license_number: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      status: ['available'],
    });

    if (this.id) {
      this.service.getById(this.id).subscribe((data: Driver) => {
        this.form.patchValue(data);
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/drivers']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/drivers']);
  }

}
