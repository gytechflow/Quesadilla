import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController, ModalController } from '@ionic/angular';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router, NavigationExtras } from '@angular/router';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { OrderService } from 'src/app/services/order/order.service'
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { OrderedPageModal } from './modal-ordered.page';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';
import { STRING_TYPE } from '@angular/compiler';
// import {CartItem} from 'src/app/'
@Component({
  selector: 'app-ordered',
  templateUrl: './ordered.page.html',
  styleUrls: ['./ordered.page.scss'],
})
export class OrderedPage extends ThemePage implements OnInit {
  available: any;
  ishidden = false;
  buttonDisabled = false;
  categories = null;
  categoriesItem = [];
  products = null;
  product_name = [];
  product_categories = [];
  order: Order = <Order>{};
  item_qty = 1;
  cartProducts: Order[] = [];
  cart_quantity: any;
  note: any;
  // drop=false;
  //products: any;
  status: any;
  timerSubscription: Subscription;
  count: number = 0;
  private quantities: number[];
  TAG: string = "OrderedPage";

  constructor(
    private categoriesService: CategoriesService,
    private platform: Platform,
    private connectivityProvider: ConnectivityProvider,
    public alertController: AlertController,

    private translate: TranslateService,
    public loadingCtrl: LoadingController,
    private netAware: NetworkErrorRouterService,
    private orderService: OrderService,
    private orderStorageService: OrderStorageService,
    // private networkService: NetworkService,
    private productService: ProductsService,
    private modalCtrl: ModalController,
    theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
    this.loadOrder();
    this.loadCategories();
    this.loadProducts();
    this.getQty();
    //this.loadProductCategories();
    // this.loadProductCategories();
  }

  getProductNote(note) {
    if (note === "" || note === undefined || note === null) {
      return this.translate.instant('ORDER.Note');
    } else {
      return note;
    }
  }

  ionViewDidEnter() {
    this.loadOrder();
  }
  acceptOrders() {
    this.orderService.acceptOrder(30000).subscribe(res => {
      this.available = res;
      console.log("Le service est", this.available);
    },
      error => {
        this.netAware.showAlert(
          error,
          [
            {
              text: this.translate.instant('MISC.RETRY'),
              handler: () => { this.acceptOrders() }
            },
            {
              text: this.translate.instant('MISC.OKAY'),
            },
          ],
          this.TAG + "acceptOrder");
      })
  }

  loadCategories() {
    let sortfield = 't.rowid', sortorder = 'ASC', limit = '100', type = 'product';

    this.categoriesService.getCategories(sortfield, sortorder, limit, type, 30000)

      .subscribe(res => {
        this.categories = res;
        for (const category of this.categories) {
          this.categoriesItem.push({
            drop: false,
          })

          this.getCategoryItems(category.id);

          this.product_name = this.product_categories;
          // console.log('Categories RESULT >> '+this.product_name);
        }


      }
        ,
        (error) => {
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.loadCategories() }
              },
            ],
            this.TAG + "loadCategories");
        });


  }

  getCategoryItems(categoryId) {
    this.categoriesService.getProductCategories(categoryId, 'product', 30000)
      .subscribe(res => {
        this.products = res;

        for (const item of this.products) {
          this.product_categories.push({
            product_id: item.id,
            label: item.label,
            product_category_id: categoryId,
            qty: 1,
            description: item.description,
            description_split: item.description.split(' ')[0],
            note: "",
            note_public: item.note_public,
            price: Number(item.price).toFixed(2),
            ishidden: false
          });
        }

      },
        error => {
          this.netAware.showAlert(
            error,
            [
              {
                text: this.translate.instant('MISC.RETRY'),
                handler: () => { this.getCategoryItems(categoryId) }
              },
            ],
            this.TAG + "loadCategories");
        }
      )
  }





  Drop(category) {
    // this.drop= !this.drop;
    category.drop = !category.drop;
  }

  loadProductCategories(id) {
    let type = 'product';

    this.categoriesService.getProductCategories(id, type, 30000).subscribe(res => {
      this.products = res;

    })
  }


  loadProducts() {
    let sortfield = 't.ref', sortorder = 'ASC', limit = '100';

    this.productService.getProducts(sortfield, sortorder, limit, 30000).subscribe(res => {
      // console.log('Products RESULT >> '+res)
    })
  }
  openStep2() {
    //this.route.navigate(['ordered-step2']);
    this.netAware.gotoPage('ordered-step2', null, true);

  }

  ShowDescription(item) {

    let navigationExtras: NavigationExtras = {
      state: {
        item: item
      }
    };
    //this.route.navigate(['detail'], navigationExtras)
    this.netAware.gotoPage('detail', navigationExtras, true);
  }


  getQty() {
    if (this.item_qty == 0) {
      return this.item_qty = 1;
    }
    return this.item_qty;
  }

  incrementQty(item) {
    item.qty += 1;
  }


  decrementQty(item) {
    if (item.qty - 1 < 1) {
      item.qty = 1;
    }
    else {
      item.qty -= 1;
    }
    console.log(item.qty);
  }

  loadOrder() {
    /** Get cart products from local storage */
    this.orderStorageService.getOrders().then(order => {

      this.cartProducts = order;
      if (this.cartProducts !== null) {
        this.cart_quantity = this.cartProducts.length;
        console.log(this.cartProducts.length + " product(s)")
      } else {
        console.log("Cart is empty");
        this.cart_quantity = 0;
      }
    })
  }

  addtoCart(id, name, quantity, price, description, item) {
    this.order.id = id;
    this.order.name = name;
    this.order.quantity = quantity;
    this.order.price = price;
    this.order.description = description;
    this.order.note_public = item.note_public;
    this.order.label = name;
    this.order.note = item.note;
    this.orderStorageService.addOrder(this.order).then(order => {
      this.loadOrder();
      item.disable = true;
      console.log('order added')
    })
  }


  toggle(item) {
    item.ishidden = !item.ishidden;
    console.log("Send note to Product");
  }
  getCountProduct(id) {
    let i: number = 0;
    for (let elemt of this.product_categories) {
      if (elemt.product_category_id == id) {
        i++;
      }
    }
    return i;
  }

  parseInt(id: any) {
    return parseInt(id);
  }

  async openModal(prod_details) {
    const modal = await this.modalCtrl.create({
      component: OrderedPageModal,
      componentProps: { details: prod_details },
      showBackdrop: false,
      swipeToClose: true,
      cssClass: 'backTransparent'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }
}
