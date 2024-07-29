import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../../services/hotel.service';
import { LocalStorageService } from '../../../services/localstorage.service';
import { ReviewService } from '../../../services/review.service';
import { reviewModel } from '../../../model/review';
import { HotelModal } from '../../../model/hotelmodal';
import { UserService } from '../../../services/user.service';
import { userModal } from '../../../model/userModal';

@Component({
  selector: 'app-get-review',
  templateUrl: './get-review.component.html',
  styleUrl: './get-review.component.scss'
})
export class GetReviewComponent implements OnInit{

hotelModal:HotelModal[] = [];
reviewModel:reviewModel[] = [];
userId:string;
//kullanıcı adlarını gösterme
users:userModal[]
userMap: { [key: string]: any } = {}; 

  constructor( 
    private localService:LocalStorageService,
    private hotelService:HotelService,
    private reviewService: ReviewService,
    private userService: UserService
  ){

  }

  ngOnInit(): void {

   this.userId=this.localService.getItem("Token").userId
    this.hotelService.getMyHotels(this.userId).subscribe(response => this.hotelModal=response );
  
    this.userService.get().subscribe(resp => {
      this.users= resp
      this.createUserMap()
    })
  }

  onHotelSelect(event: Event){
    const selectedHotelId = (event.target as HTMLSelectElement).value;
    this.reviewService.getbyIdHotel(selectedHotelId).subscribe(response =>{
      this.reviewModel = response 
    });
  }


  // Kullanıcı ismini yorumlara göstermek için userMap
createUserMap(): void {
  this.userMap = {};
  this.users.forEach(userMap => {
    this.userMap[userMap.id] = userMap;
  });
}

// kullanıcı ismini idye göre getir
getUserName(userId: string): string {
  const user = this.userMap[userId];
  return user ? user.email : "Bilinmeyen Kişi";
}




}
