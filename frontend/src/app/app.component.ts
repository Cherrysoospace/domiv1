import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'argon-dashboard-angular';
  showToast = false;
  toastMessage = '';
  private sub?: Subscription;

  constructor(private notification: NotificationService) {
    this.sub = this.notification.messages$.subscribe(msg => {
      this.showToast = !!msg;
      this.toastMessage = msg || '';
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
