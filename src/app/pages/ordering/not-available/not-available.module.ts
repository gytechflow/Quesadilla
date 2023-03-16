import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { NotAvailablePageRoutingModule } from './not-available-routing.module';

import { NotAvailablePage } from './not-available.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    NotAvailablePageRoutingModule
  ],
  declarations: [NotAvailablePage]
})
export class NotAvailablePageModule {}
