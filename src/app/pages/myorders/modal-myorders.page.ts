import { HttpErrorResponse } from '@angular/common/http';
import { Component,Input,OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';
@Component({
  selector: 'app-modal-myorders',
  templateUrl: 'modal-myorders.page.html',
  styleUrls: ['modal-myorders.page.scss'],
})
export class OrderedPageModal {

  name: string;
  @Input() details: any;

  constructor(private modalCtrl: ModalController, private navParams: NavParams,
    private netAware: NetworkErrorRouterService,) { }

  OnInit() {
    this.details = this.navParams.data.details;
    //onsole.log(this.details);
  }

  orderNotes(_t15: any) {
    this.netAware.showAlert(new HttpErrorResponse({
      status:_t15.libelle,
      statusText:_t15.ref_ext+"."
    }))
    }

  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  stringify(arg0: any) {
    return JSON.stringify(arg0).replace("\"", "").replace("\"", "");
  }

  getDateFromTms(tms){
    return new Date(tms*1000).toLocaleString("de-DE",{ year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  stripDecimal(amt){
    if(amt===null)
      return 0
    return Number.parseFloat(amt).toFixed(2);
  }

  getColor(status) {
    switch (status) {
      case "2":
      case "1": {
        return "--ion-color-primary"
      }
      case "-1":
      case "3": {
        return "--ion-color-9c1c1c"
      }
      default: return "--ion-color-428CC2";
    }
  }

  getStatusAsText(status) {
    switch (status) {
      case "1": {
        return "Accepted"
      }
      case "-1": {
        return "Canceled"
      }
      case "3": {
        return "Closed"
      }
      case "2": {
        return "Incomming"
      }
      default: return "Pending";
    }
  }
}