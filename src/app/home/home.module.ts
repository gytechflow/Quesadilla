import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {Device} from '@awesome-cordova-plugins/device/ngx'

import { HomePageRoutingModule } from './home-routing.module';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    
  ],
  providers: [ Network,Device],

  declarations: [HomePage]
})
export class HomePageModule {}
