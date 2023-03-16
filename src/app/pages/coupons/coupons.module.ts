import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponsPageRoutingModule } from './coupons-routing.module';

import { CouponsPage } from './coupons.page';
import { CouponsPageModal } from './modal-coupons.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CouponsPageRoutingModule
  ],
  declarations: [CouponsPage, CouponsPageModal]
})
export class CouponsPageModule {}
