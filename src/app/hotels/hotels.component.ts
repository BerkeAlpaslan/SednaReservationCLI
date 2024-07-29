import { Component, OnInit } from '@angular/core';
import { HotelService } from '../services/hotel.service';
import { HotelModal } from '../model/hotelmodal';
import { User } from '../model/user';
import { LocalStorageService } from '../services/localstorage.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent implements OnInit {


  hotel: HotelModal[] = [];
  filterText: string = "";
  Filteredhotel: HotelModal[];
  currentPageNo: number;
  totalPageCount: number;
  totalCount: number;
  pageSize: number = 12;
  pageList: number[] = [];

maxStar:boolean = null;



  constructor(
    private hotelService: HotelService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe({
      next: async (paramas) => {
        this.currentPageNo = parseInt(paramas["pageNo"] ?? 1);


        this.hotelService.getHotels(this.maxStar, this.currentPageNo - 1, this.pageSize).subscribe(data => {
          this.hotel = data;
          this.Filteredhotel = this.hotel;
          this.totalCount = data.length > 0 ? data[0].totalCount : 0;
          this.totalPageCount = Math.ceil(this.totalCount / this.pageSize);
          this.pageList = this.calculatePageList();
        });

      }
    });
  }

  calculatePageList(): number[] {
    const pageList: number[] = [];
    const delta = 3; // Gösterilecek sayfa numaralarının aralığı
  
    let startPage = Math.max(1, this.currentPageNo - delta);
    let endPage = Math.min(this.totalPageCount, this.currentPageNo + delta);
  
    for (let i = startPage; i <= endPage; i++) {
      pageList.push(i);
    }
  
    return pageList;
  }
  onInputChange() {
    if (this.filterText && this.hotel) {
      const filterTextLower = this.filterText.toLowerCase();
      this.Filteredhotel = this.hotel.filter(m =>
        m.name.toLowerCase().indexOf(filterTextLower) !== -1);
    } else {
      this.Filteredhotel = this.hotel; // filterText veya hotel boş ise, tüm otelleri göster
    }
  }

  generateAdditionalStars(starRating: number): string {
    let stars = '';
    const fullStars = Math.floor(starRating);
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fa fa-star" aria-hidden="true"></i> ';
    }
    return stars;
  }

  getStarArray(hotel: HotelModal): number[] {
    return Array(hotel.star || 0).fill(0);
  }


  onSortOrderChange(selectedValue: boolean) {

    this.maxStar=selectedValue
    this.hotelService.getHotels(this.maxStar ,  this.currentPageNo - 1, this.pageSize).subscribe(
      (data) => {
        // Gelen veriler ile yapılacak işlemler
        this.hotel = data;
        this.Filteredhotel = this.hotel;
        this.totalCount = data.length > 0 ? data[0].totalCount : 0;
        this.totalPageCount = Math.ceil(this.totalCount / this.pageSize);
        this.pageList = this.calculatePageList();
      },
      (error) => {
        console.error('Hata:', error);
      }
    );

  }
}
