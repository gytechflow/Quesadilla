import { Injectable } from '@angular/core';
import { AlertButton } from '@ionic/core';
import { Router, NavigationExtras } from '@angular/router';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from "@angular/common/http";

interface ModalElt {
  id: string,
  isloading: boolean,
}
@Injectable({
  providedIn: 'root'
})
export class NetworkErrorRouterService {
  isOnline: boolean = true;
  modalElemets: Map<string, boolean> = new Map();
  constructor(
    private connectivityProvider: ConnectivityProvider,
    private alertController: AlertController,
    private translate: TranslateService,
    private router: Router,) {
    console.log("NetWorkAwarenessPage");
    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.isOnline = online;
      if (!online) {
        this.router.navigate(['network-error']);
      }
    });
  }

  gotoPage(page: string, extras: NavigationExtras = null, dependsOnConnection: boolean = true) {
    console.log(this.isOnline);
    if (dependsOnConnection) {
      if (this.isOnline) {
        this.navigateTo(page, extras);
      } else {
        this.router.navigate(['network-error']);
      }
    } else {
      this.navigateTo(page, extras);
    }
  }

  navigateTo(page: string, extras: NavigationExtras,) {
    if (extras === null) {
      this.router.navigate([page]);
    } else {
      this.router.navigate([page], extras);
    }
  }

  showAlert(
    error: HttpErrorResponse,
    options: (string | AlertButton)[] = ["Okay"], 
    modalKey: string = "default_key", 
    onClose = () => {
      console.log("alert closed!")
    }) {
    if (!this.modalElemets.has(modalKey)) {
      this.modalElemets.set(modalKey, true);
    }
    //console.log(modalKey+" : "+this.modalElemets.get(modalKey));
    if (this.modalElemets.get(modalKey)) {
      this.modalElemets.set(modalKey, false);
      let alert = this.alertController.create({
        message:
                  `<div class="card-alert">
                    <img alt="Error" class="card-alert-image" >
                    <h3 style="text-align:center;">${(error.error?.error?.code)==undefined?this.translate.instant("HOME.NetWorkError"):error.error?.error?.code}</h3>
                    <p style="text-align:center;">${(error.error?.error?.message)==undefined?this.translate.instant("MISC.NO_NETWORK_MSG"):error.error?.error?.message}</p>
                  </div>`,
        //header: this.translate.instant('ORDER.Sorry'),
        buttons: options,
      });
      /*[
        {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
                //this.handlerMessage = 'Alert canceled';
            },
        },
        {
            text: 'Retry',
            role: 'confirm',
            handler: () => {
                //this.handlerMessage = 'Alert confirmed';
            },
        },
    ]*/
      alert.then(alert => {
        alert.present();
        alert.onDidDismiss().then(
          () => {
            this.modalElemets.set(modalKey, true);
            onClose();
          }
        )
      });
    }
  }
}
