import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DogFacts } from '../dog-facts/dog-facts';

@Component({
  selector: 'app-about-us',
  imports: [DogFacts, FormsModule],
  standalone: true,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  donationUrl =
    'https://pay.kaspi.kz/pay/hn36faf2?fbclid=PAZXh0bgNhZW0CMTEAAafSg9IGTykCKOjhPShs2OuTXNa3xhzcfsGtEh2-q8i13Q-nrp7fWmu6KODk_w_aem_vKp7r2x29M5BuuEr7OWGxg';

  email: string = '';
  subscribed = false;

  openDonationSite() {
    window.open(this.donationUrl, '_blank');
    console.log('opening new window');
  }

  subscribe() {
    if (this.email.trim()) {
      this.subscribed = true;
    }
  }
}
