import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { NetworkService } from './services/network-service';
import { CommonModule } from '@angular/common';
import { OfflineBanner } from './components/offline-banner/offline-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, OfflineBanner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('news');
  constructor(public network: NetworkService) {}
}
