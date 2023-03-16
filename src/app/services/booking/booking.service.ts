import { HttpClient, HttpErrorResponse, HttpHeaders, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
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

export class BookingService {
    tmOut:number = 50000;
    dataToSend: any;
    dataFromservice: any = "";
    private _loading = new BehaviorSubject<boolean>(false)
    setup = environment.SETUP_ENDPOINT
    bookingEndpoint = environment.BOOKING_ENDPOINT;
    bookingTypeEndPoint = environment.BOOKING_TYPE_ENDPOINT;
    apikey = environment.API_KEY

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
    AcceptBooking(constantname: any, timeoutT:number = this.tmOut) {
        return this.http.get(environment.REQUEST_URL + this.setup + '/' + constantname, { headers: this.initHeaders(), responseType: 'json' })
        .pipe(
            timeout(timeoutT),
          )
    }

    SaveBookingS(dataToSend, timeoutT:number = this.tmOut) {
        return this.http.post(environment.REQUEST_URL 
        + this.bookingEndpoint+"/addevent", dataToSend, { headers: this.initHeaders(), responseType: 'json' })
        .pipe(
            timeout(timeoutT),
          )
    }
    getFreeType(timeoutT:number = this.tmOut) {
        return this.http.get(environment.REQUEST_URL 
        + this.bookingTypeEndPoint, { headers: this.initHeaders(), responseType: 'json' })
        .pipe(
            timeout(timeoutT),
          )
    }

    getBooking(timeoutT:number = this.tmOut) {
        return this.http.get(environment.REQUEST_URL 
        + this.bookingEndpoint, { headers: this.initHeaders(), responseType: 'json' })
        .pipe(
            timeout(timeoutT),
          )
    }
    getMyBookings(socid: string, page: number, limit: number, timeoutT:number = this.tmOut) {
        let myparams = new HttpParams().set('sqlfilters', "t.fk_soc=" + socid).
            set('limit', limit).
            set('sortorder', "ASC").
            set('sortfield', "t.id").
            set('page', page);

        return this.http.get(environment.REQUEST_URL 
        + this.bookingEndpoint, { headers: this.initHeaders(), responseType: 'json', params: myparams })
        .pipe(
            timeout(timeoutT),
          )
    }
    getBookingById(id, timeoutT:number = this.tmOut) {
        return this.http.get(environment.REQUEST_URL 
        + this.bookingEndpoint + '/' + id, { headers: this.initHeaders(), responseType: 'json' })
        .pipe(
            timeout(timeoutT),
          )
    }
}