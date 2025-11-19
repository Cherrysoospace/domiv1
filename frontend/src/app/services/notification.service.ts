import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private subject = new BehaviorSubject<string | null>(null);

  get messages$() {
    return this.subject.asObservable();
  }

  show(message: string, duration = 3000) {
    this.subject.next(message);
    setTimeout(() => this.subject.next(null), duration);
  }
}
