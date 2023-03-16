import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { catchError, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {timeout} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  apikey = environment.API_KEY;
  documentsEndpoint = environment.DOCUMENTS_ENDPOINT;
  tmOut: number = 50000;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    private translate: TranslateService,
    private alertController: AlertController) { }

  initHeaders() {
    let headers = new HttpHeaders({ "content-Type": "application/json" }).set('DOLAPIKEY', this.apikey)
    return headers;
  }

  postDocument(filename, modulepart, ref, subdir, filecontent, fileencoding, overwriteifexists, createdirifnotexists, timeoutT: number = this.tmOut) {
    let postData = {
      filename: filename,
      modulepart: modulepart,
      ref: ref,
      subdir: subdir,
      filecontent: filecontent,
      fileencoding: fileencoding,
      overwriteifexists: overwriteifexists,
      createdirifnotexists: createdirifnotexists
    }
    let request = this.http.post(environment.REQUEST_URL + this.documentsEndpoint + '/upload', postData, { headers: this.initHeaders(), responseType: 'json' })
    request
    .pipe(
      timeout(timeoutT),
    )
    return request;



  }

  getDocument(modulepart, original_file, timeoutT: number = this.tmOut) {
    return this.http.get(`${environment.REQUEST_URL + this.documentsEndpoint + '/download'}?modulepart=${modulepart}&original_file=${original_file}`,
      { headers: this.initHeaders(), responseType: 'json' })
      .pipe(
        timeout(timeoutT),
      )
        /*.pipe(
          catchError((e: HttpErrorResponse) => {
            console.log('MAYBE THIS IS THE ERROR >>> '+e.error);
            console.log('OR THIS IS THE ERROR >>> '+e.message);
            // this.showAlert(e.error.message);
            throw new HttpErrorResponse(e)
        })
        )*/;
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: `<img alt="Error" class="card-alert">
                  <h3>${this.translate.instant('ORDER.Sorry')}</h3>
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
