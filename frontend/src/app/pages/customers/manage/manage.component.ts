import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'src/app/services/customer/customers.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  form!: FormGroup;
  id?: number;
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: CustomersService,
    private router: Router,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    if (this.id) {
      this.service.getById(this.id).subscribe(data => this.form.patchValue(data));
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => {
        this.notification.show('Cliente actualizado correctamente');
        this.router.navigate(['/customers']);
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.notification.show('Cliente creado correctamente');
        this.router.navigate(['/customers']);
      });
    }
  }
  
  cancel(): void {
    this.router.navigate(['/customers']);
  }
  

}
