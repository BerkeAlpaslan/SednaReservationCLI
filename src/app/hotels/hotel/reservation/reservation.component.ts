import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { roomTypeModel } from '../../../model/room-type';
import { roomModel } from '../../../model/room';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomService } from '../../../services/room.service';
import { RoomTypeService } from '../../../services/room-type.service';
import { ReservationService } from '../../../services/reservation.service';
import { reservationModel } from '../../../model/reservation';
import { LocalStorageService } from '../../../services/localstorage.service';
import {  Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {


  hotelId: string //Parametreden aldıgım idyi atamak için oluşturuldu.
  userId:string
  roomId:string
  roomType: roomTypeModel[];
  Room: roomModel[];
  totalPrice: number;
  range: FormGroup; // FormGroup tanımı
  selectedRoom: any = null;
  roomPricePerNight: number = 0;
  reservationModel: reservationModel;
  public reservationForm:FormGroup
  // Check-in ve check-out tarihlerini saklayan değişkenler
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;

   
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { hotelId: string , roomId:string},
    private roomService: RoomService, //oda bilgilerini çekmek için room servisini çağırdık
    private roomTypeService: RoomTypeService,
    private formBuilder: FormBuilder, // FormBuilder eklenmesi
    private localService: LocalStorageService, // user id için local servis
    private reservationService: ReservationService,
    private router:Router,
    public dialogRef: MatDialogRef<ReservationComponent>
  ) {
    this.hotelId = data.hotelId; //aldigimiz idyi hotelId'ye aktardık.
    this.roomId = data.roomId
    this.userId = this.localService.getItem("Token").userId; //localstorageden aldıgım token idyi userIdye aktardım.
    console.log(this.userId)
  

    this.range = new FormGroup({  //İki adet tarih nesnesini grup olarak interface tanımladık.
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
 

    this.reservationForm = this.formBuilder.group({ //model ile göndermek için Form oluşturduk. Validator ile null kontrolü yaptık.
      userId: [this.userId, Validators.required],
      hotelId: [this.hotelId, Validators.required],
      roomId: [this.roomId, Validators.required],
      checkIn: [null, Validators.required],
      checkOut: [null, Validators.required],
      totalPrice: [this.totalPrice ?? 0, Validators.required],
      status: ["PNC", Validators.required]
    });
  }


  ngOnInit(
  ): void {
    this.roomService.get().subscribe(rooms => {
      console.log(rooms)
      console.log('Injected hotelId:', this.hotelId); // hotelId'nin doğru gelip gelmediğini kontrol edin
      // Oda bilgilerini aldıktan sonra, hotelId ile filtreleriz
      this.Room = rooms.filter(room => room.hotelId === this.hotelId);
      this.roomTypeService.get().subscribe(roomType =>
        this.roomType = roomType
      );
    });

    this.selectedRoom = this.roomService.getById(this.roomId).subscribe(resp=> this.roomPricePerNight = resp.baseAdultPrice)

  }

  getRoomTypeName(roomTypeId: string): string { // Oda isimlerini. Oda tiplerinin yanına getirdik
    if (this.roomType && this.roomType.length > 0) {
      const roomType = this.roomType.find(rt => rt.id === roomTypeId);
      return roomType ? roomType.name : '';
    } else {
      return 'Bir hata oluştu';
    }
  }

  // Check-in ve check-out tarihleri arasındaki gün sayısını hesaplayan fonksiyon
  calculateTotalPrice(): number {
    if (this.checkInDate && this.checkOutDate && this.roomPricePerNight) {
      const checkIn = new Date(this.checkInDate).setHours(0, 0, 0, 0); //saatleri 0a çektik düzgün hesaplama için
      const checkOut = new Date(this.checkOutDate).setHours(0, 0, 0, 0);
      const diffInTime = checkOut - checkIn;  //Aradaki zamanı bulmak için
      const diffInDays = diffInTime / (1000 * 3600 * 24); //Fiyat hesaplama için zaman hesabı: 24 Saatte bir artıyor fiyat
      return diffInDays * this.roomPricePerNight;
    }
    return 0;
  }


  // Check-in tarihini seçerken bugünden sonraki ve check-out tarihinden önceki günler seçilebilir
  checkInFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkOut = this.checkOutDate ? new Date(this.checkOutDate) : null;
    if (checkOut) {
      checkOut.setHours(0, 0, 0, 0);
    }
    return (d || today) >= today && (!checkOut || (d || today) < checkOut);
  };

  // Check-out tarihini seçerken sadece check-in tarihinden sonraki günler seçilebilir
  checkOutFilter = (d: Date | null): boolean => {
    if (!this.checkInDate) {
      return true; // Eğer check-in tarihi seçilmemişse, tüm tarihler seçilebilir
    }
    const checkIn = new Date(this.checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    return (d || checkIn) > checkIn;
  };

  // Check-in tarihi seçildiğinde check-out tarihini sıfırla
  onCheckInDateChange(event: any): void {
    this.checkInDate = event.value;
    this.totalPrice = this.calculateTotalPrice(); // Toplam fiyatı hesapla
    this.reservationForm.patchValue({ totalPrice: this.totalPrice }); // Formu güncelle
  
    this.checkOutDate = null; // Check-out tarihini sıfırla
  }

  // Check-out tarihi değiştiğinde check-in tarihini kontrol et
  onCheckOutDateChange(event: any): void { 
    this.checkOutDate = event.value;
    this.totalPrice = this.calculateTotalPrice(); // Toplam fiyatı hesapla
    this.reservationForm.patchValue({ totalPrice: this.totalPrice }); // Formu güncelle
    if (this.checkInDate && this.checkInDate >= this.checkOutDate) {  //eğer giriş tarihi çıkış tarihinden büyük ise güvenlik için sıfırla.
      this.checkInDate = null; // Check-in tarihini sıfırla
      this.totalPrice = this.calculateTotalPrice(); // Toplam fiyatı hesapla
      this.reservationForm.patchValue({ totalPrice: this.totalPrice }); // Formu güncelle
    }
  }

  
  addReservation(): void{
    console.log(this.reservationForm.value)
    var resId:any;
     this.reservationService.add(this.reservationForm.value).subscribe(resp => 
      {
        const resId = resp.id; // resp.id'yi resId'ye atar
       console.log("ilk" +resp.id)
       this.dialogRef.close(); // Dialog penceresini kapatır
       this.router.navigate(['/payment/'+resId]);
      }
    )

    
    }

}
