import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private http: HttpClient, private router: ActivatedRoute, private _lightbox: Lightbox) {
    let id = router.snapshot.paramMap.get("id");
    this.getProductDetail(id);
    this.checkRepPermission();
    this.checkConsumerPermission();
  }

  proDetail: any = [];
  imageToShow = 0;
  repPer: boolean = false;
  likedBtn: boolean = false;
  likeBtnStatus = false;
  private _album = [];

  ngOnInit() {
  }

  setUrl(src, caption1, thumb) {
    const caption = 'image';
    let url = src.split('\\').pop(-1);
    url = './assets/' + url;
    this._album.push({
      src: url,
      caption: caption,
      thumb: thumb
  })
    return this._album;
  }

  open(index: number): void {
    console.log(index);
    // open lightbox
    const data = this.setUrl(this.proDetail.images[index].url, 'image', '');
    this._lightbox.open(data, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  getProductDetail(id) {
    let token = '';
    const data = localStorage.getItem('data');
    const prsData = JSON.parse(data);

    if (!this.isEmpty(prsData)) {
      token = prsData.token;
    }
    // if(prsData.hasOwnProperty('token')){
    //   token = prsData.token;
    // }
    // this.proDetail = data;
    let obs =  this.http.get('http://localhost:8080/api/product/'+id, {
      headers: new HttpHeaders().set('Authorization', token)
    });
    obs.subscribe((x) => {
      this.proDetail = x;
      if(this.proDetail.hasOwnProperty('hasBadge')){
        this.likeBtnStatus = this.proDetail.hasBadge;
      }
    });
  }

  changeImage(index) {
    this.imageToShow = index;
  }

  checkRepPermission() {

    const data = localStorage.getItem('data');
    const prsData = JSON.parse(data);
    console.log(prsData);
    if (!this.isEmpty(prsData)) {
      if(prsData.role == 'rep') {
        this.repPer = true;
      }
    }
  }

  deleteImage(iId) {
    var aa = confirm("Are you sure to delete!");
    if (aa) {
      const data = localStorage.getItem('data');
      const prsData = JSON.parse(data);
      console.log(prsData);
      if (!this.isEmpty(prsData)) {
        if(prsData.role == 'rep') {
          let obs =  this.http.delete('http://localhost:8080/api/product/image/' +iId, {
            headers: new HttpHeaders().set('Authorization', prsData.token)
          });
          obs.subscribe((x) => {
            this.proDetail = x;
          });
        }
      }
    }
  }

  removeManual(mId) {
 var aa = confirm("Are you sure !");
 if (aa) {
   const data = localStorage.getItem('data');
   const prsData = JSON.parse(data);
   console.log(prsData);
   if (!this.isEmpty(prsData)) {
     if(prsData.role == 'rep') {
       let obs =  this.http.delete('http://localhost:8080/api/product/manual/' +mId, {
         headers: new HttpHeaders().set('Authorization', prsData.token)
       });
       obs.subscribe((x) => {
         this.proDetail = x;
       });
     }
   }
 }

  }



  checkConsumerPermission() {
    const data = localStorage.getItem('data');
    const prsData = JSON.parse(data);
    if (!this.isEmpty(prsData)) {
      if(prsData.role == 'consumer') {
        this.likedBtn = true;
      }
    }
  }

}
