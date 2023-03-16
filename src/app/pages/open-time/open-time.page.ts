import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController, NavParams, Platform, IonApp } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SetupService } from 'src/app/services/setup/setup.service';
import { StorageService, OpenTime } from 'src/app/services/storage/storage.service';
import { ConnectivityProvider, } from 'src/app/services/network/network.service';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { NetworkErrorRouterService } from 'src/app/services/neterrror/network-error-router.service';

@Component({
  selector: 'app-open-time',
  templateUrl: './open-time.page.html',
  styleUrls: ['./open-time.page.scss'],
})
export class OpenTimePage extends ThemePage implements OnInit {

  url = "https://quesadilla-saarlouis.de/";
  label = "QDILLA_OPENING_HOURS";
  template: any;
  openingTime: OpenTime = <OpenTime>{};
  status: any;

  Options: InAppBrowserOptions = {
    location: 'no',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',
    hardwareback: 'no',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'Close',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    presentationstyle: 'pagesheet',
    fullscreen: 'yes',
  };
  TAG: string = "OpenTimePage";
  constructor(private router: Router,
    private iab: InAppBrowser,
    private storageService: StorageService,
    public navParams: NavParams,
    public platform: Platform,
    private translate: TranslateService,
    public navCtrl: NavController,
    private netAware: NetworkErrorRouterService,
    public alertController: AlertController,
    public setupService: SetupService,
    public app: IonApp,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService
  ) {
    super(theme);
  }

  ngOnInit() {

    this.connectivityProvider.appIsOnline$.subscribe(online => {
      console.log(online);

      this.status = online;
      if (online) {
        this.getTemplate();
      } else {
        this.router.navigate(['network-error']);

      }
    })

  }
  openSite() {
    this.platform.ready().then(() => {
      let target = "_blank";
      this.iab.create(this.url, target, this.Options)
    })
  }
  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

  async getTemplate() {
    this.setupService.getMailTemplate(this.label)
      .subscribe(res => {
        let result;
        result = res;
        this.template = result.content;
        // this.openingTime.template = this.template;
        // this.storageService.addTemplate(this.openingTime).then(res=>{

        // })

      },
      error => {
        this.netAware.showAlert(
          error,
          [
            {
              text: this.translate.instant('MISC.RETRY'),
              handler: () => { this.getTemplate() }
            },
          ],
          this.TAG + "AcceptMedia");
      })
  }
  async getOpeningTime() {
    this.storageService.getOpeningTime().then(res => {
      //onsole.log("template" + res);

      this.template = res.template;
    })
  }


}
