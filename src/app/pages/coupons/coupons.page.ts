import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { CouponService } from 'src/app/services/coupons/coupon.service';
import { CouponsPageModal } from './modal-coupons.page';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {
  @ViewChild("infinitescroll") infiniteScrollManager: IonInfiniteScroll;
  page = 0;
  size = 9;
  coupons = [];
  email: string;
  status = true;
  isLoading: Boolean = true;
  TAG: string = "CouponsPage";

  async viewcoupon(coupon) {
    const modal = await this.modalCtrl.create({
      component: CouponsPageModal,
      componentProps: { details: coupon },
      showBackdrop: false,
      swipeToClose: true,
      cssClass: 'backTransparent'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  constructor(private connectivityProvider: ConnectivityProvider,
    public storageService: StorageService,
    private couponservice: CouponService,
    private translate: TranslateService,
    private netAware: NetworkErrorRouterService,
    private modalCtrl: ModalController,) {
    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.status = online;
      console.log(online)
    });
  }

  ngOnInit() {
    if (this.status) {
      this.loadProfile();
    }
  }

  loadProfile() {
    this.storageService.getItems().then(user => {
      if (user == null) {
        // this.showAlertItems();
        console.log("No data");
        this.isLoading = false;
      } else {
        this.email = user.email;
        if (this.email !== null || this.email !== undefined) {
          this.getCoupons();
        } else {
          this.isLoading = false;
        }
      }

    });
  }

  async getCoupons() {
    this.isLoading = true;
    console.log('Loading data... page: ' + this.page);
    this.couponservice.getMyCoupons(this.email + "", this.page, this.size)
      //.timeout(50000)
      .subscribe(res => {
        console.log('Done');
        this.page++;
        this.infiniteScrollManager?.complete();
        this.isLoading = false;
        //onsole.log("result   {\n" + JSON.stringify(res) + "\n}");
        let coupons: any;
        coupons = res
        for (let coupon of coupons) {
          //onsole.log("result "+JSON.stringify(booking)+"\n\n"+this.socid);
          this.coupons.push(coupon);
        }
      },
        (error) => {
          console.log("We have " + error.status + " Error : ", JSON.stringify(error));
          if ("" + error.status === "" + 404) {
            this.isLoading = false;
            this.infiniteScrollManager?.complete();
          } else {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.getCoupons() }
                },
              ],
              this.TAG + "getCoupons",
              () => {
                this.isLoading = false;
              });
          }
        }
      );
  }

  refresh() {
    this.page = 0;
    this.coupons = [];
    if (this.email !== null || this.email !== undefined) {
      this.getCoupons();
    } else {
      this.isLoading = false;
    }
  }

  trackingMethod(index, item) {
    return item.id;
  }

  getDateFromTms(tms) {
    return new Date(tms * 1000).toLocaleString("de-DE", { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  stripDecimal(amt) {
    if (amt === null)
      return 0
    return Number.parseFloat(amt).toFixed(2);
  }
}
