import { Component, OnInit } from '@angular/core';
import { AnimalApi } from '../../services/animal-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animal-list.html',
  styleUrl: './animal-list.css',
})
export class AnimalList implements OnInit {
  animals: any[] = [];
  defaultImage = 'image.png';

  constructor(private animalService: AnimalApi) {}

  ngOnInit() {
    this.animalService.getAnimals(1, 100).subscribe({
      next: (data) => {
        this.animals = (data.animals || []).filter(
          (a: any) => a.primary_photo_cropped || (a.photos && a.photos.length > 0)
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPhoto(animal: any): string {
    return animal?.primary_photo_cropped?.medium || animal?.photos?.[0]?.medium;
  }
}
