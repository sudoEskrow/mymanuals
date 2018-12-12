import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  productUrl: any = '';
  constructor(private http: HttpClient, private domSanitizer: DomSanitizer) { }
  products: any = [];
  ngOnInit() {
    this.loadProdudtsWithIntrests();
  }

  loadProdudtsWithIntrests(){
    this.productUrl = 'http://localhost:8080/api/product/selection';
    let scope = this;
    let header = new HttpHeaders();
    let data = localStorage.getItem('data');
    let prsData = JSON.parse(data);
    header.append('Authorization', prsData.token);
    let obs = this.http.get(this.productUrl,{
      headers: new HttpHeaders().set('Authorization', prsData.token).set('Content-Type', 'application/json'),
    });
    obs.subscribe((x) => {
      console.log(x);
      this.products = x;
    });

  }
}
