import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusQueryParams } from 'src/app/Models/BusQueryParams';
import { EventService } from 'src/app/Services/event-service.service';
import { Router } from '@angular/router';
import { BusEvent } from 'src/app/Models/BusEvent ';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  buses: BusEvent[] = [];
  busCategories: any[] = [];
  busTypes: any[] = [];
  totalCount = 0;

  busParams: BusQueryParams = new BusQueryParams();

sortOptions = [
  { name: 'Date: Soonest', sortBy: 'TravelDate', sortDirection: 'asc' },
  { name: 'Price: Low to High', sortBy: 'Price', sortDirection: 'asc' },
  { name: 'Price: High to Low', sortBy: 'Price', sortDirection: 'desc' }
];


  @ViewChild('search') searchTerm!: ElementRef;

  // Right-side filters
  fromPlace: string = '';
  toPlace: string = '';
  fromDate: string = '';
  toDate: string = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.getBusTypes();
    this.getBusCategoryTypes();
    this.getBuses(); // initial load
  }

  // Fetch buses with all filters
  getBuses(): void {
    // Left-side filters
    this.busParams.busTypeId = this.busParams.busTypeId || undefined;
    this.busParams.busCategoryId = this.busParams.busCategoryId || undefined;
    this.busParams.sortBy = this.busParams.sortBy || 'TravelDate';

    // Right-side filters
    this.busParams.fromPlace = this.fromPlace || undefined;
    this.busParams.toPlace = this.toPlace || undefined;
this.busParams.fromDate = this.fromDate ? new Date(this.fromDate).toISOString() : '';
this.busParams.toDate = this.toDate ? new Date(this.toDate).toISOString() : '';
    // Search input
    this.busParams.search = this.searchTerm?.nativeElement?.value || undefined;

    this.eventService.getBusesForUser(this.busParams).subscribe({
      next: (response: any) => {
        this.buses = response.data;
        this.totalCount = response.totalRecords;
        this.busParams.page = response.page;
        this.busParams.pageSize = response.pageSize;
      },
      error: (err) => {
        console.error('Error loading buses', err);
      }
    });
  }


  onTypeSelected(event: any) {
  const selectedTypeId = event.target.value;
  this.busParams.busTypeId = selectedTypeId ? Number(selectedTypeId) : undefined;
  this.busParams.page = 1;
  this.getBuses();
}

onCategorySelected(event: any) {
  const selectedCategoryId = event.target.value;
  this.busParams.busCategoryId = selectedCategoryId ? Number(selectedCategoryId) : undefined;
  this.busParams.page = 1;
  this.getBuses();
}


  // onTypeSelected(typeId: number) {
  //   this.busParams.busTypeId = Number(typeId);
  //   this.busParams.page = 1;
  //   this.getBuses();
  // }

  // onCategorySelected(categoryId: number) {
  //   this.busParams.busCategoryId = Number(categoryId);
  //   this.busParams.page = 1;
  //   this.getBuses();
  // }

  onPageChanged(page: number) {
    this.busParams.page = page;
    this.getBuses();
  }

  // Right-side search / reset
  onSearch() {
    this.busParams.page = 1;
    this.getBuses();
  }

  onReset() {
    this.fromPlace = '';
    this.toPlace = '';
    this.fromDate = '';
    this.toDate = '';
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.busParams = new BusQueryParams();
    this.getBuses();
  }

  // Fetch bus types and categories
  getBusTypes() {
    this.eventService.getBusTypes().subscribe(res => this.busTypes = res);
  }

  getBusCategoryTypes() {
    this.eventService.getBusCategoryTypes().subscribe(res => this.busCategories = res);
  }

  // Optional: navigate to bus seating selection
  onviewsitting(busId: number) {
    console.log('Selected Bus ID:', busId);
    this.router.navigate(['/selection', busId]);
  }
  onSortSelected(event: any) {
  const selectedIndex = event.target.value;
  const selectedSort = this.sortOptions[selectedIndex];

  this.busParams.sortBy = selectedSort.sortBy;
  this.busParams.sortDirection = selectedSort.sortDirection;
  this.busParams.page = 1;
  this.getBuses();
}

}
