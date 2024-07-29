import { Component, Inject, OnInit } from '@angular/core';
import { RoomService } from '../../../../services/room.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { roomModel } from '../../../../model/room';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-room',
  templateUrl: './update-room.component.html',
  styleUrl: './update-room.component.scss'
})
export class UpdateRoomComponent {

  roomForm: FormGroup
  room:roomModel
 constructor(
  private roomService:RoomService,
  private fb:FormBuilder,
  private dialogref: DialogRef,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: { roomId: string },
 ){

  console.log(data.roomId)
this.roomService.getById(data.roomId).subscribe(response => {
  this.room=response
  this.updateForm()
})

this.roomForm = this.fb.group({
  id :  ['' , Validators.required],
  hotelId:  ['' , Validators.required],
  roomTypeId:  ['' , Validators.required],
  baseAdultPrice: ['' , [Validators.required, Validators.min(0), Validators.max(999999999)]],
  baseChildPrice: ['' , [Validators.required , Validators.min(0), Validators.max(999999999)]],
  status:  ['' , Validators.required]
})


 }

  updateForm():void {

    this.roomForm = this.fb.group({
      id :  this.room.id ?? '',
      hotelId:  this.room.hotelId ?? '',
      roomTypeId: this.room.roomTypeId ?? '',
      baseAdultPrice: this.room.baseAdultPrice ?? null,
      baseChildPrice: this.room.baseChildPrice ?? null,
      status:  this.room.status ?? ''
    })
  }

  updateRoom(){
    if(this.roomForm.valid)
    {
      this.roomService.update(this.roomForm.value).subscribe(response => console.log(response))
      this.dialogref.close();
      this._snackBar.open( 'Oda başarıyla Güncellendi.','',{ duration:4000 });
      
    }

  }
}
