import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MotorcyclesService } from 'src/app/services/motorcycle/motorcycles.service';
import { Motorcycle } from 'src/app/models/motorcycle/motorcycle.model';

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
    private service: MotorcyclesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      license_plate: ['', Validators.required],
      brand: ['', Validators.required],
      year: ['', Validators.required],
      status: ['']
    });

    if (this.id) {
      this.service.getById(this.id).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.router.navigate(['/motorcycles']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/motorcycles']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/motorcycles']);
  }

}
