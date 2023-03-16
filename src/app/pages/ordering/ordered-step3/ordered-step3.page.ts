import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { Item, SecondItem, StorageService } from 'src/app/services/storage/storage.service';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { Device } from '@capacitor/device'
import { map } from 'rxjs/internal/operators/map';
import * as moment from 'moment-timezone';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-ordered-step3',
  templateUrl: './ordered-step3.page.html',
  styleUrls: ['./ordered-step3.page.scss'],
})
export class OrderedStep3Page extends ThemePage implements OnInit {
  items: Item = <Item>{};
  newItem: Item = <Item>{};
  SecondItems: SecondItem = <SecondItem>{};
  newSeconItem: SecondItem = <SecondItem>{};
  order: any
  form: FormGroup;
  form2: FormGroup;
  //product_categories = [];
  socid: any;
  products: any;
  cartProducts: Order[] = [];
  sumOfQty = 0;
  recup = false;
  hide = false;
  idOrder: any;
  status: any;
  timerSubscription: Subscription;
  currentTimeDeutch:Date;
  platform: any;
  os: any;
  osversion: any;
  manufacturer
  model: any;
  information: any;
  TAG: string = "OrderedStepThree";
  constructor(
    private translate: TranslateService,
    private netAware: NetworkErrorRouterService,
    public storageService: StorageService,
    private plateform: Platform,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private connectivityProvider: ConnectivityProvider,
    public alertController: AlertController,

    private orderStorageService: OrderStorageService,
    public loadingCtrl: LoadingController,
    theme: ThemeService
  ) {
    super(theme);
    this.plateform.ready().then(async () => {
      this.loadItems();
      this.loadSecondItems()
      // this.getTypeBooking();
      const inf = await Device.getInfo();
      this.platform = inf['platform'] ? inf['platform'] : "NULL";
      this.os = inf['operatingSystem'] ? inf['operatingSystem'] : "NULL";
      this.osversion = inf['osVersion'] ? inf['osVersion'] : "NULL";
      this.manufacturer = inf['manufacturer'] ? inf['manufacturer'] : "NULL";
      this.model = inf['model'] ? inf['model'] : "NULL";

      this.information = this.platform + "|" + this.os + "|" + this.osversion + "|" + this.manufacturer + "|" + this.model;
      console.log("Les infos sont", this.information)


    });
  }

  ngOnInit() {
    //this.loadOrder();

    //  this.getStatus(); // load data contains the http request
    this.initDate();
    this.initForm();
    this.initForm2();


    /**place:['',[Validators.required]],
      town:['',[Validators.required]] */

  }

  initForm() {
    var year = this.currentTimeDeutch.getFullYear();
    var month = this.currentTimeDeutch.getMonth() + 1;
    var months = ("0" + month).slice(-2);
    var day = this.currentTimeDeutch.getDate();
    var days = ("0" + day).slice(-2);
    var hour = this.currentTimeDeutch.getHours();
    var min = this.currentTimeDeutch.getMinutes();
    this.form = this.formBuilder.group({
      socid: 2,
      date: ""+new Date(year + "-" + months + "-" + days + " " + hour + ":" + min).getTime()/1000,
      type: 0,
      phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^[0-9 ]{9}/)]],
      names: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: ['', [Validators.required, Validators.pattern(/^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/)]],
      address: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(/^[0-9 ]{4}/), Validators.minLength(4)]],
      town: ['', [Validators.required]]
    })
  }

  initForm2() {
    var year = this.currentTimeDeutch.getFullYear();
    var month = this.currentTimeDeutch.getMonth() + 1;
    var months = ("0" + month).slice(-2);
    var day = this.currentTimeDeutch.getDate();
    var days = ("0" + day).slice(-2);
    var hour = this.currentTimeDeutch.getHours();
    var min = this.currentTimeDeutch.getMinutes();
    var mins = ("0" + min).slice(-2);


    this.form2 = this.formBuilder.group({
      socid: 2,
      date: ""+new Date(year + "-" + months + "-" + days + " " + hour + ":" + mins).getTime()/1000,
      type: 0,
      phone: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^[0-9 ]{9}/)]],
      names: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: ['', [Validators.required, Validators.pattern(/^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/)]]
    })
  }

  initDate() {
    let deutch = new Date().toLocaleString("en-US", {timeZone:'Europe/Berlin'})
    console.log("first time", deutch);
    this.currentTimeDeutch = new Date(deutch);
    console.log("second time", this.currentTimeDeutch.toLocaleString());
  }

  radioChecked() {
    // console.log("show");
    this.hide = true;
    this.recup = false;
  }

  radioChecked2() {
    // console.log("hide");
    this.hide = false;
    this.recup = true;
  }

  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  async onSubmit() {

    this.loadOrder();

    //this.orderService.postOrder(this.form)
  }
  async onSubmit2() {
    this.loadOrder2();
  }


  async loadOrder() {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('BOOKING.Wait'),
    });

    loading.present().then(() => {
      this.getOrders(loading);
    });
  }

  getOrders(loading) {
    let product_categories = [];
    this.orderStorageService.getOrders().then(order => {
      this.cartProducts = order;

      for (let product of this.cartProducts) {
        product_categories.push({
          fk_product: product.id,
          qty: product.quantity,
          ref_ext: product.note
        })
      }
      this.products = product_categories;
      //onsole.log('Submit Test 1: ' + this.products);
      console.log(this.form.value);
      let addresse = this.form.value.address + " " + this.form.value.code + " " + this.form.value.town;
      console.log(addresse);
      let dataToSend = JSON.stringify(this.form.value);
      //onsole.log(dataToSend);

      this.postOrder(loading, product_categories, addresse);
    },
      error => {
        this.netAware.showAlert(
          error,
          [
            {
              text: this.translate.instant('MISC.RETRY'),
              handler: () => { this.getOrders(loading) }
            },
          ],
          this.TAG + "getOrders");
      });
  }

  postOrder(loading, product_categories, addresse) {
    this.orderService.postOrder(
      this.form.value.socid,
      ""+this.currentTimeDeutch.getTime()/1000,
      this.form.value.type,
      product_categories,
      this.form.value.phone,
      this.form.value.names,
      this.form.value.email,
      addresse,
      this.information)
      .subscribe(result => {
        this.getOrderDetails(loading, result);
      },
        (error) => {
          loading.dismiss();
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.postOrder(loading, product_categories, addresse) }
              },
            ],
            this.TAG + "postOrder");
        })
  }

  getOrderDetails(loading, result) {
    this.orderService.getOrderById(result)
      .subscribe(res => {
        this.order = res;
        this.socid = this.order.socid;
        this.newItem.id = Date.now();
        this.newItem.email = this.form.value.email;
        this.newItem.name = this.form.value.names;
        this.newItem.phone = this.form.value.phone;
        this.newSeconItem.street = this.form.value.address;
        this.newSeconItem.code = this.form.value.code;
        this.newSeconItem.town = this.form.value.town;

        this.OrderDetails(JSON.stringify(result));
        this.storageService.addItem(this.newItem).then(item => {
          this.newItem = <Item>{};
        });
        this.storageService.addSecondItem(this.newSeconItem).then(item => {
          this.newSeconItem = <SecondItem>{};
        });

        //onsole.log('Submit Test 3: ' + result);
        loading.dismiss();
        this.form.reset();
      },
        (error) => {
          loading.dismiss();
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => {
                  this.getOrderDetails(loading, result)
                }
              },
            ],
            this.TAG + "getOrderDetails");
        });
  }

  async loadOrder2() {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('BOOKING.Wait'),
    });
    loading.present().then(() => {
      this.postOrder2(loading);
    })
  }

  postOrder2(loading) {
    let product_categories = [];
    this.orderStorageService.getOrders().then(order => {
      this.cartProducts = order;

      for (let product of this.cartProducts) {
        product_categories.push({
          fk_product: product.id,
          qty: product.quantity,
          ref_ext: product.note
        })
      }
      this.products = product_categories;
      //onsole.log('Submit Test 1: ' + this.products);
      //onsole.log(this.form2.value);

      let dataToSend = JSON.stringify(this.form2.value);
      //onsole.log(dataToSend);
      this.orderService.postOrder2(
        this.form2.value.socid,
        ""+this.currentTimeDeutch.getTime()/1000,
        this.form2.value.type,
        product_categories,
        this.form2.value.phone,
        this.form2.value.names,
        this.form2.value.email,
        this.information
      )
        .subscribe(result => {
          this.getOrderDetails2(loading, result);
        },
          (error) => {
            loading.dismiss();
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.postOrder2(loading) }
                },
              ],
              this.TAG + "postOrder2");
          })
    });
  }

  getOrderDetails2(loading, result) {
    this.orderService.getOrderById(result)
      .subscribe(res => {
        this.order = res;
        this.socid = this.order.socid;
        this.newItem.id = Date.now();
        this.newItem.email = this.form2.value.email;
        this.newItem.name = this.form2.value.names;
        this.newItem.phone = this.form2.value.phone;

        this.OrderDetails(JSON.stringify(result));
        this.storageService.addItem(this.newItem).then(item => {
          this.newItem = <Item>{};
          this.loadItems();
        });
        //onsole.log('Submit Test 3: ' + res);
        loading.dismiss();
        this.form2.reset();
      },
        error => {
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.getOrderDetails2(loading, result) }
              },
            ],
            this.TAG + "getOrderDetails2");
        })
  }

  OrderDetails(id: any) {
    if (this.hide == true && this.recup == false) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
          socid: this.socid,
          name: this.form.value.names,
          email: this.form.value.email,
          phone: this.form.value.phone,
          address: this.form.value.address,
          place: this.form.value.code,
          town: this.form.value.town,
          date: this.form.value.date

        }
      }
      //this.route.navigate(['orderdetails'], navigationExtras);
      this.netAware.gotoPage('orderdetails', navigationExtras, true);
      this.form.reset();
    } else if (this.hide == false && this.recup == true) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
          socid: this.socid,
          name: this.form2.value.names,
          email: this.form2.value.email,
          phone: this.form2.value.phone,
          date: this.form2.value.date

        }
      }
      //this.route.navigate(['orderdetails'], navigationExtras);
      this.netAware.gotoPage('orderdetails', navigationExtras, true);
      this.form2.reset();
    }

  }

  loadLocalStorage() {
    /** Get cart products from local storage */
    this.orderStorageService.getOrders().then(order => {

    })
  }
  loadItems() {
    if (this.items == null) {
      console.log("Pas de precedente reservation")
    } else {
      this.storageService.getItems().then(items => {
        this.items = items;
        //console.log("User Phone"+ this.items.phone)
      });
    }
  }

  loadSecondItems() {
    if (this.SecondItems == null) {
      console.log("Pas de precedente reservation")
    } else {
      this.storageService.getSecondItems().then(items => {
        this.SecondItems = items;
        //console.log("User Phone"+ this.items.phone)
      });
    }
  }

  getSocId(id: any) {
    this.orderService.getOrderById(id)
      .subscribe(res => {
        this.order = res;
        this.socid = this.order.socid;
        console.log("SOCID>>>>>> " + this.socid);
      })

  }
}
