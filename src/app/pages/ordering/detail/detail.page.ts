import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Router, NavigationExtras } from '@angular/router';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage extends ThemePage implements OnInit {

  product: any;

  constructor(
    private route: Router,
    private netAware: NetworkErrorRouterService,
    public alertController: AlertController,
    private translate: TranslateService,
    theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
    this.product = this.route.getCurrentNavigation().extras.state.item;
  }

  Comeback() {
    //this.route.navigate(['ordered']);
    this.netAware.gotoPage('ordered', null, true);

  }
  Cart() {
    //this.route.navigate(['ordered-step2']);
    this.netAware.gotoPage('ordered-step2', null, true);
  }
  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

}
