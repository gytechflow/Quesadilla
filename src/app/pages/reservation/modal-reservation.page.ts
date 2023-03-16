import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-reservation',
  templateUrl: 'modal-reservation.page.html',
  styleUrls: ['modal-reservation.page.scss'],
})
export class ReservationPageModal {

  name: string;
  @Input() details: any;

  constructor(private modalCtrl: ModalController, private navParams: NavParams) { }

  OnInit() {
    this.details = this.navParams.data.details;
    console.log(this.details);
  }

  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  stringify(arg0: any) {
    return JSON.stringify(arg0).replace("\"", "").replace("\"", "");
  }

  getColor(status) {
    switch (status) {
      case "50": {
        return "--ion-color-primary"
      }
      case "100": {
        return "--ion-color-9c1c1c"
      }
      default: return "--ion-color-428CC2";
    }
  }

  getStatusAsText(status) {
    switch (status) {
      case "50": {
        return "Accepted"
      }
      case "100": {
        return "Closed"
      }
      default: return "Pending";
    }
  }

  getDateFromTms(tms) {

    return new Date(tms * 1000).toLocaleString("de-DE", { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  getTimeFromTms(tms) {

    return new Date(tms * 1000).toLocaleString("de-DE", { hour: 'numeric', minute: '2-digit' });
  }
}