import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Item, StorageService } from 'src/app/services/storage/storage.service';
import { addIcons } from 'ionicons';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

addIcons({
  'calendar-f': "./../../../assets/icon/calendar-full.svg"
});

@Component({
  selector: 'app-bookingdetails',
  templateUrl: './bookingdetails.page.html',
  styleUrls: ['./bookingdetails.page.scss'],
})
export class BookingdetailsPage extends ThemePage implements OnInit {
  id: any;
  socid: any;
  ids: any;
  data: any;
  label: any;
  email: any;
  date: any;
  heure: any;
  numero: any;
  place: any;
  dateR: any;
  gmt: any
  currentDate = new Date();
  items: Item = <Item>{};


  constructor(private route: ActivatedRoute,
    private netAware: NetworkErrorRouterService,
    public alertController: AlertController,
    private storageService: StorageService,
    private translate: TranslateService,
    theme: ThemeService
  ) {
    super(theme);
    this.route.queryParams.subscribe(params => {
      console.log('booking for' + params.label + params.id);
      if (params) {
        this.id = params.id;
        this.socid = params.socid;
        this.label = params.label;
        this.email = params.email;
        this.date = params.date;
        this.heure = params.heure;
        this.numero = params.numero;
        this.place = params.place;
        this.dateR = params.dateR;
        this.gmt = params.gmt;
        //alert(this.id+" loool");
      }
    })
  }

  ngOnInit() {
    this.save();
    console.log("Socid" + this.socid);
  }
  menu() {
    //this.router.navigate(['menu']);
    this.netAware.gotoPage('menu', null, true);
  }
  home() {
    //this.router.navigate(['home']);
    this.netAware.gotoPage('home', null, true);
  }
  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  save() {
    this.items.email = this.email;
    this.items.id = Date.now();
    this.items.phone = this.numero;
    this.items.name = this.label;
    this.items.socid = this.socid;
    this.storageService.addItem(this.items).then(item => {
      this.items = <Item>{};
    })
  }

}
