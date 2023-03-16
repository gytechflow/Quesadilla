import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { OrderedPageModal } from './modal-myorders.page';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationExtras } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  @ViewChild("infinitescroll") infiniteScrollManager: IonInfiniteScroll;
  page = 0;
  size = 9;
  orders = [];
  socid: number;
  status = true;
  isLoading: Boolean = true;
  TAG: string = "MyOrdersPage";

  async vieworders(order) {
    const modal = await this.modalCtrl.create({
      component: OrderedPageModal,
      componentProps: { details: order },
      showBackdrop: false,
      swipeToClose: true,
      cssClass: 'backTransparent'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

  constructor(private connectivityProvider: ConnectivityProvider,
    public storageService: StorageService,
    private translate: TranslateService,
    private netAware: NetworkErrorRouterService,
    private orderService: OrderService,
    private modalCtrl: ModalController) {
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
        this.socid = user.socid;
        if (this.socid !== undefined && this.socid !== null) {
          this.getOrders();
        } else{
          this.isLoading = false;
        }
      }

    });
  }

  async getOrders() {
    this.isLoading = true;
    console.log('Loading data... page: '+this.page);
    this.orderService.getMyOrders(this.socid + "", this.page, this.size)
      //.timeout(50000)
      .subscribe(res => {
        console.log('Done');
        this.page++;
        this.infiniteScrollManager?.complete();
        //this.getOrders();
        this.isLoading = false;
        //onsole.log("result   {\n" + JSON.stringify(res) + "\n}");
        let bookings: any;
        bookings = res
        for (let booking of bookings) {
          //console.log("result "+JSON.stringify(booking)+"\n\n"+this.socid);
          this.orders.push(booking);
        }
        if (this.orders.length > 0) {
          
        }
      },
        (error) => {
          console.log("We have " + error + " Error : "+JSON.stringify(error));
          if ("" + error.status === "" + 404) {
            this.isLoading = false;
            this.infiniteScrollManager?.complete();
          } else {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.refresh() }
                },
              ],
              this.TAG + "statOrders",
              () => {
                this.isLoading = false;
              });
          }
        }
      );
  }

  refresh(){
    this.page = 0;
    this.orders = [];
    if (this.socid !== undefined && this.socid !== null) {
      this.getOrders();
    } else{
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
        return this.translate.instant('BOOKING.ACCEPTED')
      }
      case "-1": {
        return this.translate.instant('ORDER.CANCELED')
      }
      case "3": {
        return this.translate.instant('BOOKING.CLOSED')
      }
      case "2": {
        return this.translate.instant('ORDER.INCOMING')
      }
      default: return this.translate.instant('BOOKING.PENDING');
    }
  }
}
