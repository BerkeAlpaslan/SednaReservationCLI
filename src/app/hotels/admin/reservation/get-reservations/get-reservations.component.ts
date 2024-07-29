import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../../../services/reservation.service';
import { reservationModel } from '../../../../model/reservation';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-get-reservations',
  templateUrl: './get-reservations.component.html',
  styleUrl: './get-reservations.component.scss'
})
export class GetReservationsComponent implements OnInit{

  hotelId:string="string";
  myHotelRezervation :reservationModel[] = []; 

  constructor(
    private rezervationService: ReservationService,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
this.activatedRoute.params.subscribe(params=> {
  this.rezervationService.getByHotelRezervation(params["id"]).subscribe(data => this.myHotelRezervation = data);
});
}



}
