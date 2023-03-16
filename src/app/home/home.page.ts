import { Component } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service'
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { map } from 'rxjs/internal/operators/map';
import { Storage } from "@ionic/storage";
import { BookingService } from '../services/booking/booking.service';
import { addIcons } from 'ionicons';
import { ThemePage } from '../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common'
import { Item, SecondItem, StorageService, ProfilePic } from 'src/app/services/storage/storage.service';

addIcons({
  'flag-en': 'assets/icon/menu-001.svg'
});
//import { Network } from '@capacitor/network';
const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends ThemePage {
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: true
  };
  booking = "QLLA_ACCEPT_BOOKINGS";
  media = "QLLA_ACCEPT_MEDIAS"
  available: any = 0;
  bookingAv: any = 0;
  mediaAv: any;
  timerSubscription: Subscription;
  status: any;
  
  response: any;
  label = "QDILLA_DISPLAYED_NEWS";
  news: any;
  TAG: string = "HomePage";
  nameToGreet: string = "";

  constructor(
    private route: Router,
    private location: Location,
    private menu: MenuController,
    private orderService: OrderService,
    private bookingService: BookingService,
    public storageService: StorageService,
    private router: ActivatedRoute,
    private translate: TranslateService,
    private storage: Storage,
    private netAware: NetworkErrorRouterService,
    public loadingCtrl: LoadingController,
    private platform: Platform,
    private connectivityProvider: ConnectivityProvider,
    public alertController: AlertController,
    theme: ThemeService
  ) {
    super(theme);
    this.platform.ready().then(() => {

      // this.loadFiles();
      // this.router.queryParams.subscribe( params =>{
      //   if(params){
      //     this.image = params.image;
      //   }else{
      //     this.image = this.source;
      //   }
      // })
    })

    this.platform.backButton.subscribe(() => {
      //navigator['app'].exitApp();
      if (this.route.url === "/home") {
        navigator['app'].exitApp();
      }
    });
  }

  ngOnInit() {
    this.getStatus(); // load data contains the http request 
    this.getConnectivity();
    this.accept();
  }

  ionViewDidEnter() {
    //this.loadFiles();
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.storageService.getItems().then(user => {
      if (user !== null) {
        this.nameToGreet = ", " + user.name;
      }
    });
  }

  getConnectivity() {
    this.connectivityProvider.appIsOnline$.subscribe(online => {

    })
  }

  getStatus() {
    /*if(this.status === false){
      this.route.navigate(['network-error']);
    }*/
  }



  accept() {
    if (this.netAware.isOnline) {
      this.orderService.acceptOrder()
        .pipe(
          catchError((e: HttpErrorResponse) => {
            console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
            console.log('OR THIS IS THE ERROR >>> ' + e.message);
            this.netAware.showAlert(
              e,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.accept() }
                },
                {
                  text: this.translate.instant('MISC.OKAY'),
                },
              ],
              this.TAG + "acceptOrder");
            throw new HttpErrorResponse(e)
          })
        )
        .subscribe(res => {
          this.available = res;
          console.log("Le service de commande", this.available);
        })

      this.bookingService.AcceptBooking(this.booking)
        .pipe(
          catchError((e: HttpErrorResponse) => {
            console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
            console.log('OR THIS IS THE ERROR >>> ' + e.message);
            this.netAware.showAlert(
              e,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.accept() }
                },
                {
                  text: this.translate.instant('MISC.OKAY'),
                },
              ],
              this.TAG + "AcceptBooking");
            throw new HttpErrorResponse(e)
          })
        )
        .subscribe(res => {
          this.bookingAv = res;
          console.log("Le service de reservation est ", this.bookingAv);

        })

      this.bookingService.AcceptBooking(this.media)
        .pipe(
          catchError((e: HttpErrorResponse) => {
            console.log('MAYBE THIS IS THE ERROR >>> ' + e.error);
            console.log('OR THIS IS THE ERROR >>> ' + e.message);
            this.netAware.showAlert(
              e,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.accept() }
                },
                {
                  text: this.translate.instant('MISC.OKAY'),
                },
              ],
              this.TAG + "AcceptMedia");
            throw new HttpErrorResponse(e)
          })
        )
        .subscribe(res => {
          this.mediaAv = res;
          console.log("Le service de media est ", this.mediaAv);
        })
      if (!this.available) {
        return 1;
      }
    }

  }

  /** Menu button */
  openFirst() {
    console.log("Open first");

    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  openProfile() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        //image: this.image
      }
    }


    this.netAware.gotoPage('account', navigationExtras, false)

  }

  openLanguage() {
    //this.route.navigate(['language']);
    this.netAware.gotoPage('language', null, true);
  }
  openMenu() {
    //this.route.navigate(['menu']);
    this.netAware.gotoPage('menu', null, true);
  }

  openBooking() {
    if (this.bookingAv == 1) {
      //this.route.navigate(['booking']);
      this.netAware.gotoPage('booking', null, true);
    } else if (this.bookingAv == 0) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          message: this.translate.instant('BOOKING.NotAvailable')
        }
      }
      //this.route.navigate(['not-available'], navigationExtras);
      this.netAware.gotoPage('not-available', navigationExtras, true);
    }
  }

  openTable() {
    //this.route.navigate(['table']);
    this.netAware.gotoPage('table', null, true);
  }

  openTime() {
    //this.route.navigate(['open-time']);
    this.netAware.gotoPage('open-time', null, true);
  }

  openOrdered() {
    this.accept();
    if (this.available == 1) {
      //this.route.navigate(['ordered']);
      this.netAware.gotoPage('ordered', null, true);
    } else if (this.available == 0) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          //message: this.translate.instant('ORDER.NotAvailable')
        }
      }
      //this.route.navigate(['not-available'], navigationExtras);
      this.netAware.gotoPage('not-available', navigationExtras, true);
    }

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
