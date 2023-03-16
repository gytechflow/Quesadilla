import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,HttpHandler } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {timeout} from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';
import {  LoadingController, AlertController} from '@ionic/angular';

import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class SetupService {
  apikey=environment.API_KEY;
  setup_emailTemplateEnpoint=environment.SETUP_MAILTEMPLATE_ENDPOINT;
  tmOut: number = 50000;
  constructor(  private http:HttpClient, private router: Router,private route:ActivatedRoute,
    public loadingCtrl: LoadingController,
    private translate: TranslateService,
    private alertController: AlertController) { }


    initHeaders(){
      let headers = new HttpHeaders({"content-Type":"application/json"}).set('DOLAPIKEY',this.apikey)
      return headers;
    }


    getMailTemplate(label, timeoutT: number = this.tmOut) {
      return this.http.get(`${environment.REQUEST_URL + this.setup_emailTemplateEnpoint}?label=${label}`, {headers: this.initHeaders(), responseType:'json'})
      .pipe(
        timeout(timeoutT),
      )
      /*.pipe(
        catchError((e: HttpErrorResponse) => {
          console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
          console.log('OR THIS IS THE ERROR >>> '+e.message);
          this.showAlert(e.error.message);
          throw new HttpErrorResponse(e)
      })
      )*/;
    }

    showAlert(msg) {
      let alert = this.alertController.create({
        message: this.translate.instant('ORDER.LoadingOrderError2'),
        header: this.translate.instant('ORDER.LoadingOrderError1'), 
        buttons: ['OK']
      });
      alert.then(alert => alert.present());
    }
}
