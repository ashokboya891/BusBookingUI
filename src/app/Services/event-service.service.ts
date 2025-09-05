import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
// import { BusEvent, EventBusDetails } from '../Models/BusEvent ';
import { BusEvent,BusCategory,BusType, ApiResponse } from "src/app/Models/BusEvent ";
// import { SeatInfo } from "src/app/Models/SeatInfo";
import { BusQueryParams } from '../Models/BusQueryParams';
import { EventSeatMap } from '../Models/SeatInfo';
@Injectable({
  providedIn: 'root'
})
export class EventService {
   apiUrl = environment.BusServiceapiUrl ;
   bookingurl = environment.BookingServiceapiUrl ;
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<BusEvent[]> {
    return this.http.get<BusEvent[]>(`${this.apiUrl}Admin/GetAllEvents`);
  }
  getEventById(eventId: number): Observable<BusEvent> {
    return this.http.get<BusEvent>(`${this.apiUrl}Admin/GetEventById?Id=${eventId}`);
  }
  addEvent(event: BusEvent): Observable<BusEvent> {
    return this.http.post<BusEvent>(`${this.apiUrl}Admin/CreateNewEvent`, event);
  }

  
  // Get bus layout by eventId
  getBusDataByEventId(eventId: number): Observable<EventSeatMap> {
    return this.http.get<EventSeatMap>(`${this.bookingurl}events/${eventId}/seats`);
  }

  // getBusDataByEventId(eventId: number): Observable<SeatInfo[]> {
  //   return this.http.get<SeatInfo[]>(`${this.bookingurl}events/${eventId}/seats`);
  // }

  uploadImage(Id:number,file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}Admin/upload-image`, formData);
  }
getBuses(params: BusQueryParams): Observable<ApiResponse<Event>> {
  let httpParams = new HttpParams()
    .set('Search', params.search ?? '')
    .set('FromPlace', params.fromPlace ?? '')
    .set('ToPlace', params.toPlace ?? '')
    .set('BusTypeId', params.busTypeId?.toString() ?? '')
    .set('BusCategoryId', params.busCategoryId?.toString() ?? '')
    .set('FromDate', params.fromDate ?? '')
    .set('ToDate', params.toDate ?? '')
    .set('SortBy', params.sortBy)
    .set('SortDirection', params.sortDirection)
    .set('Page', params.page.toString())
    .set('PageSize', params.pageSize.toString());

  return this.http.get<ApiResponse<Event>>(
    `${this.apiUrl}Admin/GetAllEvents`, 
    { params: httpParams }
  );
}
getBusesForUser(params: BusQueryParams): Observable<ApiResponse<Event>> {
  let httpParams = new HttpParams()
    .set('Search', params.search ?? '')
    .set('FromPlace', params.fromPlace ?? '')
    .set('ToPlace', params.toPlace ?? '')
    .set('BusTypeId', params.busTypeId?.toString() ?? '')
    .set('BusCategoryId', params.busCategoryId?.toString() ?? '')
    .set('FromDate', params.fromDate ?? '')
    .set('ToDate', params.toDate ?? '')
    .set('SortBy', params.sortBy)
    .set('SortDirection', params.sortDirection)
    .set('Page', params.page.toString())
    .set('PageSize', params.pageSize.toString());

  return this.http.get<ApiResponse<Event>>(
    `${this.apiUrl}User/GetAllEvents`, 
    { params: httpParams }
  );
}

  // getBuses(params: BusQueryParams): Observable<any> {
  //   let httpParams = new HttpParams()
  //     .set('Search', params.search ?? '')
  //     .set('FromPlace', params.fromPlace ?? '')
  //     .set('ToPlace', params.toPlace ?? '')
  //     .set('BusTypeId', params.busTypeId?.toString() ?? '')
  //     .set('BusCategoryId', params.busCategoryId?.toString() ?? '')
  //     .set('FromDate', params.fromDate ?? '')
  //     .set('ToDate', params.toDate ?? '')
  //     .set('SortBy', params.sortBy)
  //     .set('SortDirection', params.sortDirection)
  //     .set('Page', params.page.toString())
  //     .set('PageSize', params.pageSize.toString());

  //   return this.http.get<EventBusDetails>(`${this.apiUrl}Admin/GetAllEvents`, { params: httpParams });
  // }

  getBusTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Admin/GetBusTypes`);
  }
  getBusCategoryTypes():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}Admin/GetBusCategoryies`);
  }
  deleteEventPhoto(eventId: number, photoId: number) {
  return this.http.delete<any>(
    `${this.apiUrl}Admin/DeleteImage/${photoId}`
  );
  }

  updateEvent(id: number, data: any): Observable<any> {
  return this.http.put<any>(
    `${this.apiUrl}Admin/UpdateEvent?Id=${id}`,
    data
  );
}

  // 🔹 Delete Event
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Admin/DeleteEvent?Id=${id}`);
  }

  uploadProductPhoto(formData: FormData) {
  return this.http.post(`${this.apiUrl}Admin/add-photo`, formData, {
    reportProgress: true,
    observe: 'events'
  });
  }
  // Upload event photos
  uploadEventPhotos(eventId: number, files: File[]): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('eventId', eventId.toString());
    files.forEach(file => formData.append('files', file, file.name));

    const req = new HttpRequest(
      'POST',
      `${this.apiUrl}Admin/AddEventPhotos`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      }
    );

    return this.http.request(req);
  }

}
