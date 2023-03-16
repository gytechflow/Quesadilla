import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, IonApp } from '@ionic/angular';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Order, OrderStorageService } from 'src/app/services/orderStorage/order-storage.service';
import { OrderService } from 'src/app/services/order/order.service'
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { map } from 'rxjs/operators';
import { ConnectivityProvider, } from 'src/app/services/network/network.service';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage extends ThemePage implements OnInit {

  loading;
  URL: string = "https://h2925736.stratoserver.net/viewimage.php?modulepart=category&entity=1&file=";
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
  isLoading: boolean = true;
  TAG: string = "MenuPage";

  constructor(private router: Router,
    private netAware: NetworkErrorRouterService,
    private categoriesService: CategoriesService,
    public navParams: NavParams,
    public platform: Platform,
    private productService: ProductsService,
    public toastController: ToastController,
    public alertController: AlertController,
    private translate: TranslateService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public app: IonApp,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService
  ) {
    super(theme);
    this.platform.backButton.subscribe( () => {
      this.home();
    });
  }


  ngOnInit() {

    // if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline ) {
    //   console.log('WE ARE OFFLINE >>>' +ConnectionStatus.Offline);
    // } else {
    //   console.log('WE ARE ONLINE >>>' +this.networkService.getCurrentNetworkStatus());
    // } 
    //this.presentLoading();
    this.loadCategories();
  }
  ionViewDidEnter() {
  }
  /*
  initializeApp() {
  this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
    if (status == ConnectionStatus.Online) {
      console.log('WE ARE ONLINE >>>' +this.networkService.getCurrentNetworkStatus());
    } 
    else {
      console.log('WE ARE OFFLINE >>>' +ConnectionStatus.Offline+" "+this.networkService.getCurrentNetworkStatus());
    }
  })
  }
  */

  home() {
    //this.router.navigate(['home']);
    this.netAware.gotoPage('home', null, false);
  }


  parseInt(id: any) {
    return parseInt(id);
  }


  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('BOOKING.Wait'),
    });
    loading.present();
  }

  dismissLoading() {
    this.loadingCtrl.dismiss();

  }
  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
  loadCategories() {
    let sortfield = 't.rowid', sortorder = 'ASC', limit = '100', type = 'product';

    this.categoriesService.getCategories(sortfield, sortorder, limit, type)

      .subscribe(res => {
        this.isLoading = false;
        this.categories = res;

        for (const category of this.categories) {
          this.categoriesItem.push({
            drop: false,
          })

          this.getCategoryItems(category.id);
          this.product_name = this.product_categories;
          // console.log('Categories RESULT >> '+this.product_name);
        }

      },
        error => {
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
    this.categoriesService.getProductCategories(categoryId, 'product')
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
            ishidden: false,
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
            this.TAG + "getCategoryItems");
        })
  }

  onMenuDetail(_t33: any) {
    let itemsList = Array();
    //onsole.log(this.product_categories);
    for (let index = 0; index < this.product_categories.length; index++) {
      const element = this.product_categories[index];
      if (element.product_category_id == _t33.id) {
        itemsList.push(element);
      }
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        itemDetails: JSON.stringify(itemsList),
        itemName: _t33.label
      }
    }
    //this.router.navigate(['menudetails'], navigationExtras);
    this.netAware.gotoPage('menudetails', navigationExtras, true);
  }
}
