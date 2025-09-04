import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BusEvent } from 'src/app/Models/BusEvent ';
import { BusQueryParams } from 'src/app/Models/BusQueryParams';
import { EventService } from 'src/app/Services/event-service.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {
  events: BusEvent[] = [];
  loading = true;
  isAdmin = true;

  busCategories: any[] = [];
  busTypes: any[] = [];
  totalCount = 0;

  busParams: BusQueryParams = new BusQueryParams();

  @ViewChild('search') searchTerm!: ElementRef;

  // Filters
  fromDate: string = '';
  toDate: string = '';
  fromPlace: string = '';
  toPlace: string = '';

  constructor(private eventService: EventService, private router: Router,private notificationService:NotificationService) {}

  ngOnInit(): void {
    this.getBusTypes();
    this.getBusCategoryTypes();
    this.getBuses(); // initial load
  }

  getBuses() {
    // Bind filters to query params
    this.busParams.fromPlace = this.fromPlace;
    this.busParams.toPlace = this.toPlace;
    this.busParams.fromDate = this.fromDate;
    this.busParams.toDate = this.toDate;
    this.busParams.search = this.searchTerm?.nativeElement?.value || '';

    this.eventService.getBuses(this.busParams).subscribe({
      next: (response: any) => {
        this.events = response.data;
        this.totalCount = response.totalRecords;
        this.busParams.page = response.page;
        this.busParams.pageSize = response.pageSize;
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.showError('Error loading events')
        console.error('Error loading events', err);
        this.loading = false;
      }
    });
  }

  getBusTypes() {
    this.eventService.getBusTypes().subscribe(res => this.busTypes = res);
  }

  getBusCategoryTypes() {
    this.eventService.getBusCategoryTypes().subscribe(res => this.busCategories = res);
  }

  onSortSelected(event: any) {
    this.busParams.sortBy = event.target.value;
    this.getBuses();
  }

  onTypeSelected(typeId: number) {
    this.busParams.busTypeId = Number(typeId);
    this.busParams.page = 1;
    this.getBuses();
  }

  onCategorySelected(categoryId: number) {
    this.busParams.busCategoryId = Number(categoryId);
    this.busParams.page = 1;
    this.getBuses();
  }

  onPageChanged(event: any) {
    this.busParams.page = event;
    this.getBuses();
  }

  onSearch() {
    this.busParams.page = 1;
    this.getBuses();
  }

  onReset() {
    this.fromDate = '';
    this.toDate = '';
    this.fromPlace = '';
    this.toPlace = '';
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.busParams = new BusQueryParams();
    this.getBuses();
  }

  goToAddEvent() {
    this.router.navigate(['/create-event']);
  }

  editEvent(trip: BusEvent) {
  this.router.navigate(['/editbus', trip.id]);
}
  // editEvent(trip: BusEvent) {
  //   console.log(trip.id);
  //   this.router.navigate(['/editbus'], { queryParams: { eventId: trip.id } });
  // }

  Delete(trip: BusEvent) {
    if (confirm("Are you sure you want to delete this event?")) {
      this.eventService.deleteEvent(trip.id).subscribe({
        next: () => {
          this.notificationService.showSuccess("Delete failed Successfully");
          this.getBuses()
        },
        error: err => console.error("Delete failed:", err)
      });
    }
  }
}
