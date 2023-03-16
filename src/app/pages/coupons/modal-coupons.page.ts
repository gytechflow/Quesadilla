import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-coupons',
  templateUrl: 'modal-coupons.page.html',
  styleUrls: ['modal-coupons.page.scss'],
})
export class CouponsPageModal {

  name: string;
  @Input() details: any;

  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private navParams: NavParams) { }

  OnInit() {
    this.details = this.navParams.data.details;
    //onsole.log(this.details);
  }

  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  stringify(arg0: any) {
    return JSON.stringify(arg0).replace("\"", "").replace("\"", "");
  }

  getDateFromTms(tms) {
    return new Date(tms * 1000).toLocaleString("de-DE", { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  stripDecimal(amt) {
    if (amt === null)
      return 0
    return Number.parseFloat(amt).toFixed(2);
  }

  redeem() {

  }

  delete() {

  }
}