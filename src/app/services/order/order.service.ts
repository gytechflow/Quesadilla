import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {timeout} from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
// import {Device} from '@capacitor/device'
import { Device } from '@ionic-native/device'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apikey = environment.API_KEY;
  orderEndpoint = environment.ORDER_ENDPOINT;
  thirdPartiesEndpoint = environment.THIRDPARTIES_ENDPOINT;
  tmOut: number = 50000;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private translate: TranslateService,
    private alertController: AlertController
  ) { }

  initHeaders() {
    let headers = new HttpHeaders({ "content-Type": "application/json" }).set('DOLAPIKEY', this.apikey)
    return headers;
  }

  postOrder(socid, date, type, lines, phone, names, email, address, pos_source, timeoutT: number = this.tmOut) {
    return this.createOrder(socid, date, type, lines, phone, names, email, pos_source, timeoutT, 'withthird');
  }

  postOrder2(socid, date, type, lines, phone, names, email, pos_source, timeoutT: number = this.tmOut) {
    return this.createOrder(socid, date, type, lines, phone, names, email, pos_source, timeoutT, 'withoutadress');
  }

  createOrder(socid, date, type, lines, phone, names, email, pos_source, timeoutT: number = this.tmOut, endpoint){
    let postData = {
      socid: socid,
      date: date,
      type: type,
      lines: lines,
      phone: phone,
      names: names,
      email: email,
      pos_source: "Mobile|" + pos_source
    }
    return this.http.post(environment.REQUEST_URL + this.orderEndpoint + '/'+endpoint, postData, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
  }
  acceptOrder(timeoutT: number = this.tmOut) {
    return this.http.get(environment.REQUEST_URL + this.orderEndpoint + '/acceptorders', { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
    /*.pipe(
        catchError((e: HttpErrorResponse) => {
            console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
            console.log('OR THIS IS THE ERROR >>> '+e.message);
            //this.showAlert(e.error.message);
            throw new HttpErrorResponse(e)
        })
    )*/;
  }
  UpdateThirdParties(socid, name, town, zip, address, phone, email, date_modification, timeoutT: number = this.tmOut) {
    let data = {
      name: name,
      address: address,
      zip: zip,
      town: town,
      phone: phone,
      email: email,
      date_modification: date_modification
    }
    return this.http.put(environment.REQUEST_URL + this.thirdPartiesEndpoint + '/' + socid, data, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
    /*.pipe(
      catchError((e: HttpErrorResponse) => {
        console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
        console.log('OR THIS IS THE ERROR >>> '+e.message);
        //this.showAlert(e.error.message);
        throw new HttpErrorResponse(e)
    })
    )*/;
  }

  getThirdParty(id, timeoutT: number = this.tmOut) {
    return this.http.get(environment.REQUEST_URL + this.thirdPartiesEndpoint + '/' + id, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
  /*.pipe(
    catchError((e: HttpErrorResponse) => {
      console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
      console.log('OR THIS IS THE ERROR >>> '+e.message);
      //this.showAlert(e.error.message);
      throw new HttpErrorResponse(e)
  })
  )*/;
  }


  getOrderById(id, timeoutT: number = this.tmOut) {
    return this.http.get(environment.REQUEST_URL + this.orderEndpoint + '/' + id, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
  /*.pipe(
    catchError((e: HttpErrorResponse) => {
      console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
      console.log('OR THIS IS THE ERROR >>> '+e.message);
      //this.showAlert(e.error.message);
      throw new HttpErrorResponse(e)
  })
  )*/;
  }

  getOrder(timeoutT: number = this.tmOut) {
    return this.http.get(environment.REQUEST_URL + this.orderEndpoint, { headers: this.initHeaders(), responseType: 'json' })
    .pipe(
      timeout(timeoutT),
    )
  /*.pipe(
    catchError((e: HttpErrorResponse) => {
      console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
      console.log('OR THIS IS THE ERROR >>> '+e.message);
      //this.showAlert(e.error.message);
      throw new HttpErrorResponse(e)
  })
  )*/;
  }

  getMyOrders(socid: string, page: number, limit: number, timeoutT: number = this.tmOut) {
    let myparams = new HttpParams().set('sqlfilters', "t.fk_soc=" + socid).
      set('limit', limit).
      set('page', page).
      set('sortfield', "t.rowid").
      set('sortorder', "ASC");
    return this.http.get(environment.REQUEST_URL + 
      this.orderEndpoint, { headers: this.initHeaders(), responseType: 'json', params: myparams })
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

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: this.translate.instant('ORDER.Sorry'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
