import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);

  onlineStatus$ = this.onlineStatus.asObservable();

  constructor() {
    this.monitor();
  }

  private monitor() {
    merge(fromEvent(window, 'online'), fromEvent(window, 'offline'))
      .pipe(
        map(() => navigator.onLine),
        startWith(navigator.onLine)
      )
      .subscribe((isOnline) => this.onlineStatus.next(isOnline));
  }

  get isOnline() {
    return this.onlineStatus.value;
  }
}
