import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { reservationModel } from '../../model/reservation';
import { LocalStorageService } from '../../services/localstorage.service';
import { HotelService } from '../../services/hotel.service';
import { HotelModal } from '../../model/hotelmodal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent{

  errorMessage:""
  hotelModel: HotelModal[]
  myReservation:reservationModel[]
  HotelMap: { [key: string]: any } = {}; 
  constructor(
    private reservationService:ReservationService,
    private localService:LocalStorageService,
    private hotelService:HotelService,
    private _snackBar:MatSnackBar
  ) { 
this.reservationService.getReservationByUserId(this.localService.getItem("Token").userId).subscribe(resp=> this.myReservation= resp)
this.hotelService.getHotels().subscribe(resp => {
  this.hotelModel=resp;
  this.createHotelMap()

})

  }

// Kullanıcı ismini yorumlara göstermek için userMap
createHotelMap(): void {
  this.HotelMap = {};
  this.hotelModel.forEach(map => {
    this.HotelMap[map.id] = map;
  });
}

// kullanıcı ismini idye göre getir
getHotelName(userId: string): string {
  const hotel = this.HotelMap[userId];
  return hotel ? hotel.name : "Bilinmeyen Otel";
}

//Duruma göre ne eşit ise !!Daha düzeltilmedi
getStatusClass(status: string): string {
  switch (status) {
      case 'PC':
      return 'active';
      case 'PNC':
      return 'inactive';
      default:
      return '';
  }}

cancelReservation(reservation:reservationModel){
  if (reservation.id != null) {
    console.log(reservation)
    
    reservation.deleted=true
   
   this.reservationService.update(reservation).subscribe(response=> {
   debugger;
    
   console.log(response)
     if(response.success == true)
     { 
      this._snackBar.open( 'Randevu Başarıyla İptal Edildi.','',{ duration:5000 });
     }
     else{
      this._snackBar.open( 'Randevu iptal edilirken bir hata oluştu : '+ response.message,'',{ duration:5000 });
     }  
   });
  }
 
}
}
