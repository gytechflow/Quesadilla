import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService, Item } from 'src/app/services/storage/storage.service';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage extends ThemePage implements OnInit {
  id: any;
  items: Item = <Item>{};

  order: any;
  socid: any;
  name: any;
  email: any;
  date: any;
  numero: any;
  addresse: any;
  addresses: any;

  place: any;
  town: any;

  addresseComplete: any;
  cartProducts: any;
  pro: any
  totalPrice: any;
  sumOfQty = 0;
  TAG: string = "OrderDetails";


  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private storageService: StorageService, 
    private netAware: NetworkErrorRouterService,
    public loadingCtrl: LoadingController,
    private orderStorageService: OrderStorageService,
    public alertController: AlertController,
    private translate: TranslateService,
    theme: ThemeService) {
    super(theme);
    this.route.queryParams.subscribe(params => {
      // console.log('order for'+params.name + params.id);
      if (params.id) {
        console.log("SociD >>>>>" + params.socid);

        this.id = params.id;
        this.socid = params.socid;
        this.name = params.name;
        this.email = params.email;
        this.date = params.date;
        this.numero = params.phone;
        this.addresse = params.address;
        this.place = params.place;
        this.town = params.town
        this.addresses = this.addresse + " " + this.place + " " + this.town;
      }
    })
  }


  ngOnInit() {
    this.loadOrder();
    this.sumOrder();
    this.save();
    this.postItems(); console.log("Socid" + this.socid);

  }
  ngOnDestroy() {
    this.orderStorageService.clearStorage();
    this.save()

  }

  menu() {
    //this.router.navigate(['menu']);
    this.netAware.gotoPage('menu', null, true);
    this.orderStorageService.clearStorage();
    this.loadOrder();
  }

  home() {
    //this.router.navigate(['home']);
    this.netAware.gotoPage('home', null, true)
    this.orderStorageService.clearStorage();
    this.loadOrder();
  }

  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  loadOrder() {
    /** Get cart products from local storage */
    this.orderStorageService.getOrders().then(order => {
      this.cartProducts = order;
    })


  }

  sumOrder() {
    this.orderStorageService.getOrders().then(order => {
      let sumOfPrice = 0
      this.cartProducts = order;
      for (var i = 0; i < this.cartProducts.length; i++) {
        sumOfPrice = sumOfPrice + (this.cartProducts[i].price * this.cartProducts[i].quantity);
        //this.sumOfQty = this.sumOfQty + this.cartProducts[i].quantity;
      }

      this.totalPrice = (sumOfPrice).toFixed(2);

      console.log('TOTAL PRICE ' + this.totalPrice + ' Sum price > ' + sumOfPrice + ' Sum quantity > ' + this.sumOfQty);
    })

  }

  save() {
    this.items.email = this.email;
    this.items.id = Date.now();
    this.items.phone = this.numero;
    this.items.name = this.name;
    this.items.socid = this.socid;
    this.storageService.addItem(this.items).then(item => {
      this.items = <Item>{};
    })
  }

  async postItems() {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('BOOKING.Wait'),
    });


    this.orderService.UpdateThirdParties(this.socid, this.name, this.town, this.place, this.addresse, this.numero, this.email, Date.now())
      .subscribe(res => {
        //onsole.log(res);
        loading.dismiss();
      },
        (error) => {
          loading.dismiss();
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.OKAY'),
                handler: () => {
                  this.postItems();
                }
              },
            ],
            this.TAG + "postItems");
        })
  }



}
