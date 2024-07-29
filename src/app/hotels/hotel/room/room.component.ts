import { Component, Input, OnInit } from '@angular/core';
import { RoomService } from '../../../services/room.service';
import { RoomTypeService } from '../../../services/room-type.service';
import { roomModel } from '../../../model/room';
import { roomTypeModel } from '../../../model/room-type';
import { ReservationComponent } from '../reservation/reservation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent  implements OnInit {

  roomModel:roomModel[]
  roomTypeModal:roomTypeModel[]
  roomTypeMap: { [key: string]: any } = {}; 

  @Input() hotelId: string = "";
  constructor(
    private RoomService:RoomService,
    private RoomTypeService: RoomTypeService,
    private dialog: MatDialog
  ){
  
  }


  ngOnInit(): void {
    this.RoomService.getRoomByHotelId(this.hotelId).subscribe(data=> this.roomModel =data);
    this.RoomTypeService.get().subscribe(data => {
      this.roomTypeModal = data
      this.createRoomTypeMap();
    })
  }

  createRoomTypeMap(): void {
    this.roomTypeMap = {};
    this.roomTypeModal.forEach(roomType => {
      this.roomTypeMap[roomType.id] = roomType;
    });
  }

  getRoomName(roomTypeId: string): string {
    const roomType = this.roomTypeMap[roomTypeId];
    return roomType ? roomType.name : "Bilinmeyen Oda";
  }

  openRezervation(hotelId:string, roomId:string){   
    const diagloRef= this.dialog.open(ReservationComponent ,{ data: {hotelId, roomId}
    });
    }

}
