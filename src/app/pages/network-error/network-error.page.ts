import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationExtras } from '@angular/router';
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Platform } from '@ionic/angular';
import { ConnectivityProvider, } from 'src/app/services/network/network.service';
import { Location } from '@angular/common'
@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.page.html',
  styleUrls: ['./network-error.page.scss'],
})
export class NetworkErrorPage extends ThemePage implements OnInit {

  online:boolean = false;

  constructor(
    private translate: TranslateService,
    private route: Router,
    private platform: Platform,
    private location: Location,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService
  ) {
    super(theme);
  }

  ngOnInit() {

    this.connectivityProvider.appIsOnline$.subscribe(online => {
      this.online = online;
      if (online) {
      } else {
        this.route.navigate(['network-error']);
      }
    })

    this.platform.backButton.subscribe(() => {
      
      if (this.route.url === "/network-error") {
        this.home();
      }
    });
  }

  home() {
    if(this.online){
      console.log("online")
      this.location.back();
    }else{
      console.log("not-online")
      this.route.navigate(['home']);
    }
  }

}
