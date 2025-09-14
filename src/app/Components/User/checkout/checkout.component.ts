import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusEvent } from 'src/app/Models/BusEvent ';
import { Traveller } from 'src/app/Models/Traveller';
import { EventService } from 'src/app/Services/event-service.service';
import { TravellerService } from 'src/app/Services/traveller.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  bookingData: any;
  eventData?: BusEvent;
  travellers: Traveller[] = [];
  selectedTravellers: Traveller[] = [];

  constructor(
    private router: Router,
    private eventService: EventService,
    private travellerService: TravellerService
  ) {
    // ✅ Correct way to capture navigation state
    const nav = this.router.getCurrentNavigation();
    this.bookingData = nav?.extras?.state?.['bookingPayload'];
  }

ngOnInit(): void {
  this.bookingData = history.state.bookingData;  // ✅ match key name
  console.log('Checkout Payload:', this.bookingData);

  if (this.bookingData?.eventId) {
    this.loadEvent(this.bookingData.eventId);
  }

const userId = sessionStorage.getItem('userId');
// console.log("DEBUG - userId:", userId);
// console.log("DEBUG - bookingData:", this.bookingData);
// console.log("DEBUG - travellerIds:", this.bookingData?.travellerIds);

if (userId && this.bookingData?.travellerIds) {
  this.loadTravellers(userId, this.bookingData.travellerIds);
  console.log("Inside IF ✅", userId, this.bookingData.travellerIds);
}
}


  loadEvent(eventId: number) {
    this.eventService.getEventByIdForUser(eventId).subscribe(event => {
      this.eventData = event;
    });
  }

  loadTravellers(userId: string, selectedIds: number[]) {
    this.travellerService.getTravellers(userId).subscribe(travellers => {
      this.travellers = travellers;
      this.selectedTravellers = travellers.filter(t =>
        selectedIds.includes(t.travelerId!)
      );
    });
  }

  goBack() {
    window.history.back();
  }

  payNow() {
    alert('Redirecting to payment gateway...');
  }
}
