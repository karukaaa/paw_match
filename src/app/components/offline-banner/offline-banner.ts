import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network-service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offline-banner.html',
  styleUrl: './offline-banner.css',
})
export class OfflineBanner {
  network = inject(NetworkService);
  cd = inject(ChangeDetectorRef);

  constructor() {
    this.network.onlineStatus$.subscribe(() => {
      this.cd.detectChanges();
      this.network.onlineStatus$.subscribe((isOnline) => {
        if (!isOnline) {
          document.body.classList.add('banner-active');
        } else {
          document.body.classList.remove('banner-active');
        }
        this.cd.detectChanges();
      });
    });
  }
}
