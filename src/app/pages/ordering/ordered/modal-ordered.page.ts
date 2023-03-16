import { Component,Input,OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-ordered',
  templateUrl: 'modal-ordered.page.html',
  styleUrls: ['modal-ordered.page.scss'],
})
export class OrderedPageModal {

  name: string;
  @Input() details: any;

  constructor(private modalCtrl: ModalController,private navParams: NavParams) {}

  OnInit(){
    this.details = this.navParams.data.details;
    //onsole.log(this.details);
  }

  close() {
    return this.modalCtrl.dismiss(null, 'close');
  }

  stringify(arg0: any) {
    return JSON.stringify(arg0).replace("\"","").replace("\"","");
    }
}