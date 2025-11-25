import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from 'src/app/services/restaurant/restaurants.service';
import { Restaurant } from 'src/app/models/restaurant/restaurant.model';

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
    private service: RestaurantsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['']
    });

    if (this.id) {
      this.service.getById(this.id).subscribe((data: Restaurant) => this.form.patchValue(data));
    }
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => this.router.navigate(['/restaurants']));
    } else {
      this.service.create(this.form.value).subscribe(() => this.router.navigate(['/restaurants']));
    }
  }

}
