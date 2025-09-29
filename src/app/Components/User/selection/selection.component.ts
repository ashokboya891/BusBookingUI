import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSeatMap, SeatDto, ImageDto } from 'src/app/Models/SeatInfo';
import { Traveller } from 'src/app/Models/Traveller';
import { EventService } from 'src/app/Services/event-service.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { TravellerService } from 'src/app/Services/traveller.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  eventId: number = 0;
  eventData!: EventSeatMap;

  seatRows: (SeatDto | null)[][] = [];  // now maps 2D grid
  selectedSeats: SeatDto[] = [];
  selectedTravellerIds: number[] = []; // for booking
  travellers: Traveller[] = [];
  travellerForm!: FormGroup;
  showTravellerPopup = false;
  editTravellerId: number | null = null;
    userId? : string|null; // replace with actual logged in user from auth

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private fb:FormBuilder,
    private travellerService:TravellerService,
    private notificationService:NotificationService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');

    this.loadTravellers();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEventData();
      }
    });
    this.travellerForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
      userId: [this.userId]
    });
  }

    // -------- Traveller methods ----------
  loadTravellers() {
    this.travellerService.getTravellers(this.userId!).subscribe({
      next: (res) => this.travellers = res
    });
  }

  
  openAddTraveller() {
    this.editTravellerId = null;
    this.travellerForm.reset({ userId: this.userId });
    this.showTravellerPopup = true;
  }

  openEditTraveller(trav: Traveller) {
    this.editTravellerId = trav.travellerId!;
    this.travellerForm.patchValue(trav);
    this.showTravellerPopup = true;
  }

  saveTraveller() {
    if (this.travellerForm.invalid) return;

    const data: Traveller = this.travellerForm.value;

    if (this.editTravellerId) {
      this.travellerService.updateTraveller(this.editTravellerId, data).subscribe(() => {
        this.loadTravellers();
        this.closePopup();
      });
    } else {
      this.travellerService.addTraveller(data).subscribe(() => {
        this.loadTravellers();
        this.closePopup();
      });
    }
  }

  deleteTraveller(id: number) {
    if (confirm('Delete this traveller?')) {
      this.travellerService.deleteTraveller(this.userId!,id).subscribe(() => {
        this.loadTravellers();
      });
    }
  }

  closePopup() {
    this.showTravellerPopup = false;
  }
  loadEventData() {
    this.eventService.getBusDataByEventId(this.eventId).subscribe({
      next: (data: EventSeatMap) => {
        this.eventData = data;
        this.seatRows = this.eventData.seatLayout; // map API seat layout
        // console.log("Loaded bus layout:", this.eventData);
        this.notificationService.showSuccess("Loaded bus layout")
      },
      error: (err) => {
        // console.error("Load bus layout failed:", err)
      this.notificationService.showError("Load bus layout failed:");
    }
    });
  }
toggleSeat(seat: SeatDto) {
  
  if (seat.isBooked) return;

  const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);

  if (index >= 0) {
    // Unselect seat
    this.selectedSeats.splice(index, 1);
  } else {
    // Check traveller-seat rule
    if (this.selectedSeats.length >= this.selectedTravellerIds.length) {
      this.notificationService.showInfo("You need to add/select more travellers before booking more seats.")
      return;
    }
    this.selectedSeats.push(seat);
  }
}
  isSelected(seat: SeatDto): boolean {
    
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }
  toggleTravellerSelection(trav: Traveller) {
  // No need to manually flip trav.selected
  console.log("Clicked travellerId:", trav.travellerId, "Selected:", trav.selected);

  this.selectedTravellerIds = this.travellers
    .filter(t => t.selected && t.travellerId)
    .map(t => t.travellerId!);

  console.log("Currently selected travellers:", this.selectedTravellerIds);
}

  // toggleTravellerSelection(trav: Traveller) {
  // trav.selected = !trav.selected;
  //   console.log(trav.travellerId)
  //   // Rebuild the selectedTravellerIds array fresh
  // this.selectedTravellerIds = this.travellers
  //   .filter(t => t.selected && t.travellerId)  // only selected ones
  //   .map(t => t.travellerId!);
  // if (trav.selected && trav.travellerId) {
  //   this.selectedTravellerIds.push(trav.travellerId);
  // } else {
  //   this.selectedTravellerIds = this.selectedTravellerIds.filter(id => id !== trav.travellerId);
  // }

//   console.log("Currently selected travellers:", this.selectedTravellerIds);
// }

bookTickets() {
  const bookingPayload = {
    eventId: this.eventId,
    seatNumbers: this.selectedSeats.map(s => s.seatNumber),
    travellerIds: this.selectedTravellerIds,
    userId: this.userId
  };

  console.log("Final booking payload:", bookingPayload);

  // this.bookingService.createBooking(bookingPayload).subscribe(...)
}
  goToPayment() {
    if (this.selectedSeats.length !== this.selectedTravellerIds.length) {
      alert('Please assign all travellers to seats before proceeding.');
      return;
    }

     const bookingPayload = {
    eventId: this.eventId,
    travellerIds: this.selectedTravellerIds,
    seats: this.selectedSeats.map(s => s.seatNumber),
    totalAmount: this.selectedSeats.length * (this.eventData?.price || 0)
  };

    // ✅ Navigate to checkout and pass payload via state
    console.log("payload data sending to checkout"+bookingPayload)
    this.router.navigate(['/checkout'], { state: { bookingData: bookingPayload } });
  }

// goToPayment() {
//   if (this.selectedSeats.length !== this.selectedTravellerIds.length) {
//     alert("Please match the number of travellers with selected seats.");
//     return;
//   }

//   const bookingPayload = {
//     eventId: this.eventId,
//     travellerIds: this.selectedTravellerIds,
//     seats: this.selectedSeats.map(s => s.seatNumber),
//     totalAmount: this.selectedSeats.length * (this.eventData?.price || 0)
//   };

//   console.log("Booking data:", bookingPayload);
  // TODO: Call booking API, then navigate to payment page
  // this.router.navigate(['/payment'], { state: { bookingPayload } });
// }

}
