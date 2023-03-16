import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController, NavParams, Platform, IonApp } from '@ionic/angular';
import { ThemePage } from 'src/app/theme.page';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-not-available',
  templateUrl: './not-available.page.html',
  styleUrls: ['./not-available.page.scss'],
})
export class NotAvailablePage extends ThemePage implements OnInit {
  message: any;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private alertController: AlertController,
    private plateform: Platform,
    private route: ActivatedRoute,
    theme: ThemeService
  ) {
    super(theme);
    this.plateform.ready().then(() => {
      this.route.queryParams.subscribe(params => {
        if (params) {
          //this.message = params.message;
        }
      })
    })
  }

  ngOnInit() {
  }
  Contact() {
    let alert = this.alertController.create({
      message: ' <ion-icon name="call" slot="start"></ion-icon><a href="tel:+4968317646555" > +4968317646555 </a>',
      header: this.translate.instant('CALL.Title'),
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
  home() {
    this.router.navigate(['home']);
  }
}
