import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  isOffline = signal(!navigator.onLine);

  constructor() {
    this.sync();

    window.addEventListener('online', () => this.sync());
    window.addEventListener('offline', () => this.sync());

    setInterval(() => this.sync(), 1500);
  }

  private sync() {
    const offline = !navigator.onLine;
    this.isOffline.set(offline);
  }
}
