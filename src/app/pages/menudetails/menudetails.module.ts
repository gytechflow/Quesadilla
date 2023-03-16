import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenudetailsPageRoutingModule } from './menudetails-routing.module';

import { MenudetailsPage } from './menudetails.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenudetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [MenudetailsPage]
})
export class MenudetailsPageModule {}
