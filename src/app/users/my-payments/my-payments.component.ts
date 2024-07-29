import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/localstorage.service';
import { PaymentService } from '../../services/payment.service';
import { PaymentModel } from '../../model/payment';
import { HotelService } from '../../services/hotel.service';
import { HotelModal } from '../../model/hotelmodal';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrl: './my-payments.component.scss'
})
export class MyPaymentsComponent implements OnInit {

  paymentModel: PaymentModel[]
  hotelModel: HotelModal[]
  hotelMap: { [key: string]: any } = {}; 
  constructor(
    private localService:LocalStorageService,
    private paymentService:PaymentService,
    private hotelService:HotelService
  ) {
  
  }
  ngOnInit(): void {
       this.paymentService.getByUserId(this.localService.getItem("Token").userId).subscribe(resp => this.paymentModel = resp)
       this.hotelService.getHotels().subscribe(response => {
        this.hotelModel = response
        this.createHotelMap()
      })

  }

  createHotelMap(): void {
    this.hotelMap = {};
    this.hotelModel.forEach(resp => {
      this.hotelMap[resp.id] = resp;
    });
  }

  getHotelName(hotelId: string): string {
    const hotel = this.hotelMap[hotelId];
    return hotel ? hotel.name : "Bilinmeyen Otel";
  }



}
