import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { BookingWrapper } from 'src/app/Models/booking-dashboard.model';
import { BookingService } from 'src/app/Services/BookingService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
    animations: [
    trigger('slideToggle', [
      state('void', style({ height: '0', opacity: 0 })),
      transition(':enter', [animate('300ms ease-out', style({ height: '*', opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ height: '0', opacity: 0 }))])
    ])
    ]
})
export class DashboardComponent {
  showActionModal = false;

  activeSection: string | null = null;
  selectedTravel: any = null;
bookings: any[] = [];
  allBookings: BookingWrapper[] = [];
  upcoming: BookingWrapper[] = [];
  completed: BookingWrapper[] = [];
  cancelled: BookingWrapper[] = [];
  failed: BookingWrapper[] = [];
  // confirmed:BookingWrapper[]=[];


  isLoading = true;
  errorMessage = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token'); // 👈 assuming you saved JWT in localStorage
    if (token) {
      this.fetchBookings();
      this.bookingService.getMyBookings(token).subscribe({
        next: (response) => {
          this.bookings = response.data.myBookings;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load bookings';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'User not logged in';
      this.isLoading = false;
    }
  }

  fetchBookings(): void {
    const token = sessionStorage.getItem('token'); // 👈 assuming you saved JWT in localStorage
    if(token)
    {  
      this.bookingService.getMyBookings(token).subscribe({
        next: (res: any) => {
          this.allBookings = res.data.myBookings || [];
          this.categorizeBookings();
        },
        error: (err) => console.error('❌ Error fetching bookings:', err)
      });
    }
    else {
      this.errorMessage = 'User not logged in from fetch';
      this.isLoading = false;
    }
  }
categorizeBookings(): void {
  const today = new Date();

  // Clear old lists before categorizing
  this.upcoming = [];
  this.completed = [];
  this.cancelled = [];
  this.failed = [];

  this.allBookings.forEach((item) => {
    const travelDate = new Date(item.event?.travelDate);
    const paymentStatus = item.payment?.status?.toLowerCase() || '';
    const bookingStatus = item.booking?.status?.toLowerCase() || '';

    // 🟥 Cancelled category
    if (
      bookingStatus === 'cancelled' ||
      paymentStatus === 'refunded' ||
      (paymentStatus === 'refund initiated')
    ) {
      this.cancelled.push(item);
    }
    // 🟨 Failed category
    else if (paymentStatus === 'failed' || bookingStatus === 'failed') {
      this.failed.push(item);
    }
    // 🟩 Upcoming category
    else if (travelDate > today) {
      this.upcoming.push(item);
    }
    // 🟦 Completed category
    else if (
      travelDate <= today &&
      paymentStatus === 'paid' &&
      bookingStatus === 'confirmed'
    ) {
      this.completed.push(item);
    }
    // 🟪 Fallback (unusual cases)
    else {
      this.failed.push(item);
    }
  });
}

  // categorizeBookings(): void {
  //   const today = new Date();

  //   this.allBookings.forEach((item) => {
  //     const travelDate = new Date(item.event.travelDate);
  //     const paymentStatus = item.payment?.status?.toLowerCase() || '';
  //     const bookingStatus = item.booking?.status?.toLowerCase() || '';

  //     if (paymentStatus === 'Refunded' && bookingStatus=='Cancelled' ) {
  //       this.cancelled.push(item);
  //     } 
  //     else if (paymentStatus === 'failed') {
  //       this.failed.push(item);
  //     } 
  //     else if (travelDate > today) {
  //       this.upcoming.push(item);
  //     } 
  //     else if (travelDate <= today && (paymentStatus === 'paid'&& bookingStatus === 'confirmed')) {
  //       this.completed.push(item);
  //     }
  //     else{
  //        this.failed.push(item);
  //     }
  //   });
  // }
   toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
    this.selectedTravel = null;
  }
    selectTravel(item: any) {
    this.selectedTravel = item;
  }

  closeDetail() {
    this.selectedTravel = null;
  }
  get confirmed(): any[] {
  const fromUpcoming = this.upcoming.filter(
    item =>
      item.payment?.status?.toLowerCase() === 'paid' &&
      item.booking?.status?.toLowerCase() === 'confirmed'
  );

  const fromCompleted = this.completed.filter(
    item =>
      item.payment?.status?.toLowerCase() === 'paid' &&
      item.booking?.status?.toLowerCase() === 'confirmed'
  );

  return [...fromUpcoming, ...fromCompleted];
}

//   get confirmed(): any[] {
//   return this.upcoming.filter(
//     item =>
//       item.payment?.status?.toLowerCase() === 'paid' &&
//       item.booking?.status?.toLowerCase() === 'confirmed'
//   );
// }

downloadTicket(travel: any) {
  this.bookingService.downloadTicket(travel).subscribe({
    next: (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;

      // You can use travel.event.title or bookingId as filename
      a.download = `${travel.event?.title || 'ticket'}_${travel.booking?.bookingId}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err: any) => {
      console.error('Error downloading ticket:', err);
      alert('Failed to download ticket. Please try again.');
    }
  });
  }
openActionModal(travel: any) {
  this.selectedTravel = travel;
  this.showActionModal = true;
}

closeActionModal() {
  this.showActionModal = false;
}

canCancel(travel: any): boolean {
  if (!travel?.event?.travelDate) return false;

  const travelTime = new Date(travel.event.travelDate).getTime();
  const now = new Date().getTime();
  const threeHours = 3 * 60 * 60 * 1000;

  return travelTime - now > threeHours;
}


cancelBooking(travel: any) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  const token = sessionStorage.getItem('token');
  if (!token) {
    alert('User not logged in.');
    return;
  }

  const bookingId = travel.booking?.bookingId;
  const paymentId = travel.payment?.paymentId;  // ✅ Fix: comes from travel.payment, not travel.booking
  const eventId = travel.event?.id;             // ✅ Fix: comes from travel.event, not travel.booking

  if (!bookingId || !paymentId || !eventId) {
    console.log(bookingId+" "+eventId+" "+paymentId)
    alert('Invalid booking data.');
    return;
  }

  this.bookingService.cancelBooking(bookingId, paymentId, eventId, token).subscribe({
    next: (res: any) => {
      alert(res.message || 'Booking cancelled successfully!');
      this.showActionModal = false;
      this.fetchBookings(); // refresh dashboard
    },
    error: (err: any) => {
      console.error('❌ Cancel error:', err);
      alert(err.error?.message || 'Failed to cancel booking.');
    }
  });
}



}
