import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSeatMap, SeatDto, ImageDto } from 'src/app/Models/SeatInfo';
import { EventService } from 'src/app/Services/event-service.service';

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

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEventData();
      }
    });
  }

  loadEventData() {
    this.eventService.getBusDataByEventId(this.eventId).subscribe({
      next: (data: EventSeatMap) => {
        this.eventData = data;
        this.seatRows = this.eventData.seatLayout; // map API seat layout
        console.log("Loaded bus layout:", this.eventData);
      },
      error: (err) => console.error("Load bus layout failed:", err)
    });
  }

  toggleSeat(seat: SeatDto) {
    if (seat.isBooked) return;

    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  isSelected(seat: SeatDto): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }

}
