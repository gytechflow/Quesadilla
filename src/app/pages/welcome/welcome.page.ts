import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { Platform, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage extends ThemePage implements OnInit {

  constructor(
    private route: Router, 
    theme: ThemeService, 
    private platform: Platform,
    private translate: TranslateService) {
    super(theme);
    this.platform.backButton.subscribe(() => {
      //navigator['app'].exitApp();
      if (this.route.url === "/welcome") {
        navigator['app'].exitApp();
      }
    });
  }

  ngOnInit() {
  }

  openHome() {
    this.route.navigate(['home']);
  }

}
