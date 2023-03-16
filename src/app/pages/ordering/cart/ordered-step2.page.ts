import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { Platform, AlertController } from '@ionic/angular';

import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-ordered-step2',
  templateUrl: './ordered-step2.page.html',
  styleUrls: ['./ordered-step2.page.scss'],
})
export class OrderedStep2Page extends ThemePage implements OnInit {
  nbre = 1;
  ishidden = false;
  //sumOfPrice = 0;
  sumOfQty = 0;
  totalPrice: any;
  testPrice: any;
  status: any;
  timerSubscription: Subscription;


  cartProducts: Order[] = [];

  constructor(
    private netAware: NetworkErrorRouterService,
    private translate: TranslateService,
    public alertController: AlertController,
    private connectivityProvider: ConnectivityProvider,
    private orderStorageService: OrderStorageService,
    private platform: Platform,
    theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
    //this.getQty();
    // this.getStatus(); // load data contains the http request 

    this.loadOrder();
    this.sumOrder();
  }

  /*
  ionViewDidEnter() {
    this.loadOrder();
    this.sumOrder();
  }
  */
  openStep3() {
    //this.route.navigate(['ordered-step3']);
    this.netAware.gotoPage('ordered-step3', null, true)

  }

  // Fired when the component routing to has finished animating.
  ionViewDidEnter() {
    this.loadOrder();
    this.sumOrder();

  }



  incrementQty(item) {
    item.quantity += 1;
    this.orderStorageService.updateOrder(item).then(order => {
      this.sumOrder();
    })
  }


  decrementQty(item) {
    if (item.quantity - 1 < 1) {
      item.quantity = 1;

    }
    else {
      item.quantity -= 1;
    }
    this.orderStorageService.updateOrder(item).then(order => {
      this.sumOrder();
    })
    //onsole.log(item.quantity);
  }

  ShowDescription(item) {
    //this.route.navigate(['detail']);

    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    //this.route.navigate(['detail'], navigationExtras)
    this.netAware.gotoPage('detail', navigationExtras, false);
  }

  loadOrder() {
    /** Get cart products from local storage */
    this.orderStorageService.getOrders().then(order => {
      if (order == null) {
        console.log("Cart is empty");

      } else {
        this.cartProducts = order;
        console.log(this.cartProducts.length + " product(s)")

      }
    })
  }

  deleteOrder(id) {
    /** Delete a product from local storage */
    // console.log('Mon index',id);
    this.orderStorageService.deleteOrderIndex(id).then(order => {
      this.sumOrder();
    })
  }

  sumOrder() {
    this.orderStorageService.getOrders().then(order => {
      let sumOfPrice = 0
      this.cartProducts = order;
      if (this.cartProducts !== null) {
        for (var i = 0; i < this.cartProducts.length; i++) {
          sumOfPrice = sumOfPrice + (this.cartProducts[i].price * this.cartProducts[i].quantity);
          //this.sumOfQty = this.sumOfQty + this.cartProducts[i].quantity;
        }
      } else {
        console.log("cart is empty");

      }


      this.totalPrice = (sumOfPrice).toFixed(2);

      console.log('TOTAL PRICE ' + this.totalPrice + ' Sum price > ' + sumOfPrice + ' Sum quantity > ' + this.sumOfQty);
    })

  }
  deleteAll() {
    this.orderStorageService.clearStorage();
    this.sumOrder();


  }

}
