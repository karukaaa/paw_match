import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogApiService } from '../../services/dog-api-service';

@Component({
  selector: 'app-dog-facts',
  imports: [CommonModule],
  templateUrl: './dog-facts.html',
  styleUrl: './dog-facts.css',
})
export class DogFacts implements OnInit {
  fact = '';
  moreFacts: string[] = [];
  breeds: { name: string; description: string }[] = [];
  loading = true;

  constructor(private dogApi: DogApiService) {}

  ngOnInit(): void {
    this.loadFact();
    this.loadBreeds();
  }

  loadFact() {
    this.loading = true;
    this.dogApi.getRandomFact().subscribe({
      next: (fact) => {
        this.fact = fact;
        this.loading = false;
      },
      error: () => {
        this.fact = 'Could not fetch a dog fact right now 🐾';
        this.loading = false;
      },
    });
  }

  loadBreeds() {
    this.dogApi.getBreeds().subscribe({
      next: (breeds) => (this.breeds = breeds.slice(0, 5)),
      error: (err) => console.log(err),
    });
  }
}
