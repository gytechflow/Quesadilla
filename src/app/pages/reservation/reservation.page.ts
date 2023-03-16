import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TableService } from '../../services/table/table.service';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { Item, SecondItem, StorageService, ProfilePic } from 'src/app/services/storage/storage.service';
import { DocumentsService } from 'src/app/services/document/documents.service';
import { AlertController, IonInfiniteScroll, IonList, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PagingClient } from 'src/app/services/paging/paging.client';
import { ReservationPageModal } from "./modal-reservation.page"
import { element } from 'protractor';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage extends ThemePage implements OnInit, PagingClient {
  @ViewChild("list") listManager: IonList;
  @ViewChild("infinitescroll") infiniteScrollManager: IonInfiniteScroll;

  data: any;
  rooms: any;
  roomList: any[];
  oldBooking = [];
  dropbooking: boolean = false;
  items: Item = <Item>{};
  items2: SecondItem = <SecondItem>{};
  countbookings: number;
  socid: any;
  booking: any;
  length = 0;
  list = document.getElementById('list');
  infiniteScroll = document.getElementById('infinite-scroll');
  page = 0;
  size = 9;
  isLoading: Boolean = true;
  TAG: string = "ReservationPage";




  constructor(
    private route: Router,
    private tableService: TableService,
    private bookingService: BookingService,
    public storageService: StorageService,
    private documentService: DocumentsService,
    private alertController: AlertController,
    private translate: TranslateService,
    private netAware: NetworkErrorRouterService,
    private modalCtrl: ModalController,
    theme: ThemeService) {
    super(theme);
  }

  ngOnInit() {
    this.tableService.getFreeTable().subscribe(result => {
      this.data = result;

      this.roomList = [... new Set(this.data.map(x => x.floor))];


    }, async error => {
      console.log(error);
    });

    this.loadUserInfo();
  }
  loadUserInfo() {
    this.storageService.getItems().then(user => {
      if (user == null) {
        // this.showAlertItems();
        console.log("No data");
        this.isLoading = false;
      } else {
        this.socid = user.socid;
        this.socid = user.socid;
        if (this.socid !== null || this.socid !== undefined) {
          this.getBookings();
        } else {
          this.isLoading = false;
        }
      }

    });
  }

  openTable(id) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.route.navigate(['table'], navigationExtras);
  }

  loadScrollManager() {
    const that = this;
    this.infiniteScroll.addEventListener('ionInfinite', async function () {
      that.getBookings();
    });
  }

  onAddElements(elements) {
    this.infiniteScrollManager.complete();
  }

  async getBookings() {
    this.isLoading = true;
    console.log('Loading data... page: ' + this.page);
    this.bookingService.getMyBookings(this.socid, this.page, this.size)
      .subscribe(res => {
        //onsole.log("result   {\n" + JSON.stringify(res) + "\n}");
        console.log('Done');
        this.booking = res;
        this.page++;
        this.isLoading = false;
        this.infiniteScrollManager?.complete();
        for (let booking of this.booking) {
          //console.log("result "+JSON.stringify(booking)+"\n\n"+this.socid);
          this.oldBooking.push(booking);
        }
      },
        (error) => {
          console.log("We have " + error.status + " Error : " + JSON.stringify(error));
          if ("" + error.status === "" + 404) {
            this.infiniteScrollManager?.complete();
            this.isLoading = false;
          } else {
            this.netAware.showAlert(
              error,
              [
                {
                  text: this.translate.instant('MISC.RETRY'),
                  handler: () => { this.getBookings() }
                },
              ],
              this.TAG + "getBookings",
              () => {
                this.isLoading = false;
              });
          }
        }
      );
  }

  refresh() {
    this.page = 0;
    this.oldBooking = [];
    if (this.socid !== null || this.socid !== undefined) {
      this.getBookings();
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

  getTimeFromTms(tms) {

    return new Date(tms * 1000).toLocaleString("de-DE", { hour: 'numeric', minute: '2-digit' });
  }


  getBgColor(status) {
    switch (status) {
      case "50": {
        return "--ion-color-primary"
      }
      case "100": {
        return "--ion-color-9c1c1c"
      }
      default: return "--ion-color-428CC2";
    }
  }

  getStatusAsText(status) {
    switch (status) {
      case "25":
      case "50": {
        return this.translate.instant('BOOKING.ACCEPTED')
      }
      case "100": {
        return this.translate.instant('BOOKING.CLOSED')
      }
      default: return this.translate.instant('BOOKING.PENDING');
    }
  }

  async modalOpen(resa) {
    const modal = await this.modalCtrl.create({
      component: ReservationPageModal,
      componentProps: { details: resa },
      showBackdrop: false,
      swipeToClose: true,
      cssClass: 'backTransparent'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
  }

}

