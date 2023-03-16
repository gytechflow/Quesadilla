import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    WelcomePageRoutingModule,
    TranslateModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
