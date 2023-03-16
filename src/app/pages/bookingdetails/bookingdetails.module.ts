import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingdetailsPageRoutingModule } from './bookingdetails-routing.module';

import { BookingdetailsPage } from './bookingdetails.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingdetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [BookingdetailsPage]
})
export class BookingdetailsPageModule {}
