import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { NetworkErrorPageRoutingModule } from './network-error-routing.module';

import { NetworkErrorPage } from './network-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NetworkErrorPageRoutingModule
  ],
  declarations: [NetworkErrorPage]
})
export class NetworkErrorPageModule {}
