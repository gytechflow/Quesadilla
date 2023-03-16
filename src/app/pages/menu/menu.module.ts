import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';

import {  NavParams } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuPageRoutingModule,
    TranslateModule
  ],
  providers: [
    InAppBrowser,
    NavParams,
    ],

  declarations: [MenuPage]
})
export class MenuPageModule {}
