import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelModal } from '../../../../model/hotelmodal';
import { HotelService } from '../../../../services/hotel.service';
import { LocalStorageService } from '../../../../services/localstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ValidUrlService } from '../../../../services/valid-url.service';

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrl: './add-hotel.component.scss'
})
export class AddHotelComponent implements OnInit {
  public hotelForm:FormGroup
  public userId:string
  errorMessage:string
  constructor(
    private formBuilder: FormBuilder,
    private hotelService: HotelService,
    private localService:LocalStorageService,
    private _snackBar: MatSnackBar,
    private router:Router,
    private httpValid:ValidUrlService
  ){
    this.userId=this.localService.getItem("Token").userId

    this.hotelForm = this.formBuilder.group({
      userId: [this.userId ,],
      name: ['', ],
      address: ['',],
      phone: ['',],
      email: ['', ], // Email doğrulaması ekledik
      description: ['', ],
      star: [null, ], // Min ve Max doğrulaması ekledik
      imageUrl: ['', ]
    });


  }

  ngOnInit(): void {
 
  }
  
  addHotel(){
    if (this.hotelForm.valid) {
        this.hotelService.addHotel(this.hotelForm.value).subscribe(response => {

           this._snackBar.open( 'Oda başarıyla eklendi..','',{ duration:4000 });
           this.router.navigate(['hotels/admin/myHotels']); // Rota yolunu güncelleyin
           },
        (error) => {
    
          this.errorMessage = 'Otel eklenirken bir hata oluştu' + error;
          // Hata durumunda kullanıcıya bildirim gösterebilirsiniz
        }
      );

    }


  }
}
