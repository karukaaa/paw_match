import { Component, OnInit } from '@angular/core';
import { Animal, AnimalApi } from '../../services/animal-api';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject, switchMap, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.css',
})
export class AnimalList implements OnInit {
  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  query: string = '';
  search$ = new Subject<string>();

  constructor(private animalService: AnimalApi) {
    this.search$
      .pipe(
        debounceTime(300),
        switchMap((term: string) => of(this.filterAnimals(term) as Animal[]))
      )
      .subscribe((list) => {
        this.filteredAnimals = list;
      });
  }

  ngOnInit() {
    this.animalService.getAnimals(1, 100).subscribe({
      next: (data) => {
        this.animals = (data.animals || []).filter(
          (a: any) => a.primary_photo_cropped || (a.photos && a.photos.length > 0)
        );
        this.filteredAnimals = this.animals; // показываем всех при старте
      },
      error: (err) => console.error(err),
    });
  }

  onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.query = val;
    this.search$.next(this.query);
  }

  reload() {
    this.query = '';
    this.filteredAnimals = this.animals;
  }

  getPhoto(animal: Animal): string {
    return animal?.primary_photo_cropped?.medium || animal?.photos?.[0]?.medium || '';
  }

  filterAnimals(raw: string): Animal[] {
    const query = (raw || '').trim().toLowerCase();
    if (!query) return this.animals;

    // разделяем по пробелам, удаляем пустые строки
    const terms = query.split(/\s+/).filter(Boolean);

    return this.animals.filter((a) => {
      const tags = (a.tags || []).map((t) => t.toLowerCase());
      // животное должно содержать все введённые теги
      return terms.some((term) => tags.includes(term));
    });
  }
}
