import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { reviewModel } from '../../../model/review';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../model/user';
import { LocalStorageService } from '../../../services/localstorage.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { userModal } from '../../../model/userModal';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})

export class ReviewComponent implements OnInit {

  @Input() hotelId: string = "";
  addreview:FormGroup
  userId:string
  users:userModal[]
  reviews: reviewModel[] = []; 
  userMap: { [key: string]: any } = {}; 
  errorMessage: string = ''; // Hata mesajı değişkeni
constructor(
  private reviewService: ReviewService,
  private fb:FormBuilder,
  private localService: LocalStorageService,
  private userService: UserService,
  private _snackBar: MatSnackBar

){

  //userId cagirma
  if(!!this.localService.getItem("Token")){
  this.userId = this.localService.getItem("Token").userId;
}

this.userService.get().subscribe(data =>{ 
  this.users= data
this.createUserMap();
})

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


  ngOnInit(): void {
  this.loadReviews(); //yorum güncelle
  this.addreview = this.fb.group({
    hotelId: [this.hotelId , Validators.required],
    userId: [this.userId , Validators.required],
    rating: [null , Validators.required],
    comment: ['' , Validators.required]
  })
}

loadReviews() {
  if (this.hotelId) {
    this.reviewService.getbyIdHotel(this.hotelId).subscribe(response => {
      this.reviews = response;
    });
  }
}

//yorum ekle
addReview(){
  if (this.addreview.valid) {
      this.reviewService.add(this.addreview.value).subscribe( response=>{
        console.log(response)
        this.loadReviews() // yorm getir
      }
      ,(error) => {
      
         this.errorMessage = 'Yorum yaparken bir hata oluştu Lütfen tekrar deneyin. Hata Mesajı:' + error;
         // Hata durumunda kullanıcıya bildirim
       });
    
      // this.addreview.reset(); // Formu sıfırla
      this.addreview.get('rating')?.setValue(null); // rating alanını sıfırla
      this.addreview.get('comment')?.setValue(''); // comment alanını sıfırla
      this._snackBar.open( 'Başarıyla yorum yapıldı.','',{ duration:4000 });

  }
  this.loadReviews() // yorm getir
}

}
