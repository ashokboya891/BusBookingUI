import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment.development";
import { Traveller } from '../Models/Traveller';
@Injectable({
  providedIn: 'root'
})
export class TravellerService {
  private baseUrl =environment.BookingServiceapiUrl   //'https://localhost:7022/api/travellers'; // adjust to your API

  constructor(private http: HttpClient) {}

  getTravellers(userId: string): Observable<Traveller[]> {
    return this.http.get<Traveller[]>(`${this.baseUrl}Travelers/${userId}`);
  }

  addTraveller(traveller: Traveller): Observable<Traveller> {
    return this.http.post<Traveller>(this.baseUrl+"Travelers", traveller);
  }

  updateTraveller(id: number, traveller: Traveller): Observable<Traveller> {
    return this.http.put<Traveller>(`${this.baseUrl}${id}`, traveller);
  }

  deleteTraveller(userId:string,id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl+"Travelers/"}${userId}/${id}`);
  }
}
