import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatInfo } from 'src/app/Models/SeatInfo';
import { EventService } from 'src/app/Services/event-service.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {
  SeatInfo:SeatInfo[]=[];
  eventId:number=0;
  selectedSeats: number[] = [];

  constructor(private route:ActivatedRoute,private eventServcie:EventService
  ) { }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadbusinfo();
      }
    });
  }
  loadbusinfo()
  {
        this.eventServcie.getBusDataByEventId(this.eventId).subscribe({
      next:(data) => {
        this.SeatInfo = data;
        console.log('Loaded bus data:', data);
      },
      error: err => console.error('Load failed:', err)
    });
  }
  toggleSeat(seatNumber: number, event: any) {
  if (event.target.checked) {
    this.selectedSeats.push(seatNumber);
  } else {
    this.selectedSeats = this.selectedSeats.filter(s => s !== seatNumber);
  }
}
// Divide seats into rows
getRows() {
  return Array.from({ length: 10 }); // 10 rows → 40 seats
}

getSeatsForRow(rowIndex: number, side: 'left' | 'right') {
  if (side === 'left') {
    return this.SeatInfo.slice(rowIndex * 4, rowIndex * 4 + 2);
  } else {
    return this.SeatInfo.slice(rowIndex * 4 + 2, rowIndex * 4 + 4);
  }
}


}
