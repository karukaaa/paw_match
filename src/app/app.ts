import { Component, signal } from '@angular/core';
import { AboutUs } from './components/about-us/about-us';
import { AnimalList } from './components/animal-list/animal-list';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [AboutUs, AnimalList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('paw-match');
}
