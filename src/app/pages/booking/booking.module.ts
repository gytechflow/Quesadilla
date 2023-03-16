import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';

import { BookingPage } from './booking.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule, 
    
    
  ],
  declarations: [BookingPage],
})
export class BookingPageModule {}
