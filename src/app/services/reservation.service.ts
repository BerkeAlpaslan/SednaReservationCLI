import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { reservationModel } from '../model/reservation';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  url:string ="https://localhost:7171/api";
  constructor(private http: HttpClient) { }


get(): Observable<reservationModel[]>
{
  return this.http.get<reservationModel[]>(this.url+"/Reservations")
}

getById(id:string): Observable<reservationModel>
{
  return this.http.get<reservationModel>(this.url+"/Reservations/"+id)
}

add(hotel: reservationModel): Observable<any>
{
  return this.http.post<reservationModel>(this.url+"/Reservations", hotel)
}
delete(id:string): Observable<any>
{
  return this.http.delete(this.url+"/Reservations/"+id)
}
update(hotel: reservationModel): Observable<any>
{
 return this.http.put(this.url+"/Reservations/",hotel)
}

getByHotelRezervation(hotelId:string):Observable<reservationModel[]>{
return this.http.get<reservationModel[]>(this.url+"/Reservations/hotel/"+hotelId)
}
getReservationByUserId(userId:string):Observable<reservationModel[]>{
return this.http.get<reservationModel[]>(this.url+"/Reservations/user/"+userId)
}

}
