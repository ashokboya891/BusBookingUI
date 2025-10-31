import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.GraphQl;
  private bookingapiUrl=environment.BookingServiceapiUrl;
  constructor(private http: HttpClient) {}

  getMyBookings(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const query = `
      query {
        myBookings {
          booking {
            bookingId
            eventId
            seatNumber
            price
            status
            bookingDate
            provider
          }
          payment {
            paymentId
            provider 
            providerOrderId 
            providerPaymentId
            currency 
            amount 
            status 
            createdAt 
            paidAt
          }
          traveller {
            name
            email
            phoneNumber
            age
          }
          event {
            id
            title
            description
            fromPlace
            toPlace
            price
            travelDate
          }
        }
      }
    `;

    return this.http.post<any>(
      this.apiUrl,
      { query },
      { headers }
    );
  }
  downloadTicket(travelData: any): Observable<Blob> {
  const url = 'https://localhost:7108/api/download-ticket'; // Your .NET API endpoint

  // We send travel data as JSON
  return this.http.post(this.bookingapiUrl+'download-ticket', travelData, {
    responseType: 'blob', // important for PDF
  });
}

// cancelBooking(bookingId: number,paymentId:number,eventId:number, token: string) {
//   const headers = { Authorization: `Bearer ${token}` };
//   return this.http.put(
//     `${this.bookingapiUrl}/CancelBooking?${bookingId}`,
//     {},
//     { headers, responseType: 'json' }
//   );
// }

cancelBooking(bookingId: number, paymentId: number, eventId: number, token: string) {
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Correct query string + JSON body
  return this.http.put(
    `${this.bookingapiUrl}CancelBooking?bookingId=${bookingId}`,
    { bookingId, paymentId, eventId }, // body payload
    { headers, responseType: 'json' }
  );
}


}
