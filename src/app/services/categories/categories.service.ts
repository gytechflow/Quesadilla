import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpHandler } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from '@ngx-translate/core';
import { LoadingController, AlertController } from '@ionic/angular';
import {timeout} from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  tmOut:number = 50000;
  apikey = environment.API_KEY;
  categoriesEndpoint = environment.CATEGORIES_ENDPOINT;

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

  getCategories(sortfield, sortorder, limit, type, timeoutT:number = this.tmOut) {
    return this.http.get(`${environment.REQUEST_URL + this.categoriesEndpoint}/childs?parent_id=23&sortfield=${sortfield}&sortorder=${sortorder}&limit=${limit}&type=${type}`, 
    { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
      /*.pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
          console.log('OR THIS IS THE ERROR >>> ' + e.message);
          this.showAlert(e.error.message);
          throw new HttpErrorResponse(e)
        })
      )*/;
  }

  getProductCategories(id, type, timeoutT:number = this.tmOut) {
    return this.http.get(`${environment.REQUEST_URL + this.categoriesEndpoint}/${id}/objects?type=${type}`, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
      /*.pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
          console.log('OR THIS IS THE ERROR >>> ' + e.message);
          this.showAlert(e.error.message);
          throw new HttpErrorResponse(e)
        })
      )*/;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: `<img alt="Error" class="card-alert">
                <h3>${this.translate.instant('ORDER.LoadingOrderError2')}</h3>
                <p>${this.translate.instant('ORDER.LoadingOrderError1')}<p>`,
      //header: this.translate.instant('ORDER.Sorry'),
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          handler: () => {
            //this.handlerMessage = 'Alert canceled';
          },
        },
        /*{
          text: 'Retry',
          role: 'confirm',
          handler: () => {
            //this.handlerMessage = 'Alert confirmed';
          },
        },*/
      ]
    });
    alert.then(alert => alert.present());
  }
}
