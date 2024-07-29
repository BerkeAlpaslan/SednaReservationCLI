import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelModal } from '../../../../model/hotelmodal';
import { HotelService } from '../../../../services/hotel.service';
import { roomTypeModel } from '../../../../model/room-type';
import { RoomTypeService } from '../../../../services/room-type.service';
import { RoomService } from '../../../../services/room.service';
import { LocalStorageService } from '../../../../services/localstorage.service';
import { ValidationService } from '../../../../services/validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss'
})
export class AddRoomComponent implements OnInit {

public roomForm: FormGroup
public myHotels:HotelModal[]
public roomType:roomTypeModel[];
public userId:string
errorMessage:string;
  constructor(
    private formBuilder: FormBuilder,
    private hotelsService:HotelService,
    private roomTypeService: RoomTypeService,
    private roomService: RoomService,
    private localService: LocalStorageService,
    private _snackBar: MatSnackBar,
    private router:Router,
  ){
  this.userId=this.localService.getItem("Token").userId
this.roomTypeService.get().subscribe(response => this.roomType=response);

    this.hotelsService.getMyHotels(this.userId).subscribe(data => this.myHotels=data);
    this.roomForm = this.formBuilder.group({
      hotelId: ['', Validators.required],
      roomTypeId: ['', Validators.required],
      baseAdultPrice: [null, ValidationService.adultPriceValidator()],
      baseChildPrice: [null, [Validators.required,ValidationService.childPriceValidator()]],
      status: ['']
    });
  }
  ngOnInit(): void {
  }

  onSubmit(){
    if (this.roomForm.valid) {
    console.log(this.roomForm.value);
    this.roomService.add(this.roomForm.value).subscribe(response=> {
      this._snackBar.open( 'Oda başarıyla eklendi.','',{ duration:4000 });
      this.router.navigate(["/getRoom"])
    
    },
    (error) => {
      console.error('Add Room failed:', error);
      this.errorMessage = 'Oda eklerken bir hata oluştu. Hata Mesajı:' + error;
      // Hata durumunda kullanıcıya bildirim gösterebilirsiniz
    }
  );
  
    }

  }

}
