import { Component } from '@angular/core';
import { LanguageService } from './services/language/language.service';
import { Platform,AlertController } from '@ionic/angular';
import { ConnectivityProvider } from 'src/app/services/network/network.service';
import { NavigationExtras, Router } from '@angular/router';
import {Subscription, timer} from 'rxjs';  
import { TranslateService } from '@ngx-translate/core';

import { map } from 'rxjs/internal/operators/map';

//import { NetworkService, ConnectionStatus } from './services/network/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  status: any;
  timerSubscription: Subscription; 

  constructor(private platform: Platform, private route: Router,  
    private translate: TranslateService,
  
    public alertController: AlertController,
    private connectivityProvider: ConnectivityProvider,
    private languageService: LanguageService) {
    this,this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.languageService.setInitialAppLanguage();
      this.getConnectivity();


    })
  }
  getConnectivity(){
    this.connectivityProvider.appIsOnline$.subscribe(online => {
    this.status= online;
    console.log(online)
    return this.status;
  })
  }

  // getStatus(){
  //   if(this.status === false){
  //     // this.route.navigate(['network-error']);
  //     let alert = this.alertController.create({
  //       message:  this.translate.instant('ORDER.Error2'),
  //       header: this.translate.instant('ORDER.Error1'), 
  //       buttons: ['OK']
  //     });
  //     alert.then(alert => alert.present());


  //   }
  // }

  

}
