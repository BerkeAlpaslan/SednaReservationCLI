import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { HotelService } from '../../../services/hotel.service';
import { HotelModal } from '../../../model/hotelmodal';
import { PaymentModel } from '../../../model/payment';
import { LocalStorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
myHotel:HotelModal[]
paymentModal:PaymentModel[]

  constructor(
private paymentService:PaymentService,
private hotelService:HotelService,
private localService:LocalStorageService
  ){
    
  }
  ngOnInit(): void {
    this.hotelService.getMyHotels(this.localService.getItem("Token").userId).subscribe(resp=> {
      this.myHotel=resp
    })
  }

  onHotelSelect(event: Event){
    const selectedHotelId = (event.target as HTMLSelectElement).value;
    console.log(selectedHotelId) //test
    this.paymentService.getByHotelId(selectedHotelId).subscribe(res => this.paymentModal = res);
  }

}
