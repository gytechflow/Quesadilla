import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpHandler, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from '@ngx-translate/core';
import { LoadingController, AlertController } from '@ionic/angular';
import {timeout} from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
import { time } from 'console';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  apikey = environment.API_KEY
  couponEndpoint = environment.COUPON_ENDPOINT;
  tmOut: number = 50000;

  constructor(
    private http: HttpClient, private router: Router, private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private translate: TranslateService,
    private alertController: AlertController
  ) { }

  initHeaders() {
    let headers = new HttpHeaders({ "content-Type": "application/json" }).set('DOLAPIKEY', this.apikey)
    return headers;
  }

  getMyCoupons(email: string,page:number,limit:number, timeoutT:number = this.tmOut) {
    //let myparams = new HttpParams().set('sqlfilters', "t.email"+`${fixedEncodeURIComponent("=\'nirvingcraig99+quesadilla@gmail.com\'")}` /*encodeURIComponent(email)*/).
    let myparams = new HttpParams().set('sqlfilters', `t.email${encodeURIComponent("=")}'${email}'`).
                                    set('limit',limit).
                                    set('page',page);

    let url_alt = environment.REQUEST_URL+ this.couponEndpoint +"?sortfield=t.rowid&sortorder=ASC&limit="+limit+"&page="+page+"&sqlfilters=t.email%3D'"+encodeURIComponent(email+'')+"'";
    
  return this.http.get(url_alt, 
  { headers: this.initHeaders(), responseType: 'json'/*, params: myparams*/ })
  .pipe(
    timeout(timeoutT),
  )
      /*.pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> ' + JSON.stringify(e.error));
          console.log('OR THIS IS THE ERROR >>> ' + e.message);
          console.log(' THIS IS THE URL >>> ' + e.url);
          //this.showAlert(e.error.message);
          throw new HttpErrorResponse(e)
        })
      )*/;
  }
  getCouponById(id, timeoutT:number = this.tmOut) {
    return this.http.get(environment.REQUEST_URL+ this.couponEndpoint+ '/' + id, 
    { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
      /*.pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
          console.log('OR THIS IS THE ERROR >>> ' + e.message);
          //this.showAlert(e.error.message);
          throw new HttpErrorResponse(e)
        })
      )*/;
  }

  
}

export function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).replace(/%25/g,'');
  });
 }

 export function fixedEncodeURI(str) {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}
