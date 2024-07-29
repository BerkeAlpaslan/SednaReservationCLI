import { Component, inject, OnInit } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { ActivatedRoute } from '@angular/router';
import { HotelModal } from '../../model/hotelmodal';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from './reservation/reservation.component';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class HotelComponent implements OnInit{

  hotel: HotelModal;
  readonly dialog = inject(MatDialog); //dialogpenceresi için
  constructor(
    private hotelService: HotelService,
    private activatedRoot: ActivatedRoute
  ){

  }
  ngOnInit(): void {
      this.activatedRoot.params.subscribe(params=> 
      {
        this.hotelService.getHotelById(params["id"]).subscribe(data => { this.hotel=data})
      }
      )
  }

  openRezervation(hotelId:string){
      
    const diagloRef= this.dialog.open(ReservationComponent ,{ data: {hotelId}
    });
    }

}
