import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConnectivityProvider, } from 'src/app/services/network/network.service';
import { Platform } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { ThemePage } from '../../theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-menudetails',
  templateUrl: './menudetails.page.html',
  styleUrls: ['./menudetails.page.scss'],
})
export class MenudetailsPage extends ThemePage implements OnInit {

  status: any;
  itemDetails: Array<any>;
  itemName: string;

  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private connectivityProvider: ConnectivityProvider,
    theme: ThemeService) {
    super(theme);
    this.platform.ready().then(() => {
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.itemDetails = JSON.parse(params.itemDetails);
          this.itemName = params.itemName;
        } else {
          //this.menuItem = "../../assets/images/image.jpeg";
          this.location.back();
        }
      })
    })
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

}
