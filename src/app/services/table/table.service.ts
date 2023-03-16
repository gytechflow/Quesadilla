import { Injectable, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  tablesEndpoint = environment.TABLES_ENDPOINT;
  apiKey = environment.API_KEY;
  
  constructor(private http: HttpClient, private router: Router,private route: ActivatedRoute) { }
/*
  getFreeTable() {
    return this.http.get(`${this.url}&DOLAPIKEY=${this.apiKey}`);
  }
  https://api-cors-proxy-quesadilla.herokuapp.com/
*/

  initHeaders() {
    let headers = new HttpHeaders().set('DOLAPIKEY', this.apiKey)
    return headers;

  }

  getFreeTable() {
    const proxy = ''; 
    return this.http.get(environment.REQUEST_URL + this.tablesEndpoint, {headers: this.initHeaders()});
  }
  

}
