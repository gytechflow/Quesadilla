import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationPageRoutingModule } from './reservation-routing.module';

import { ReservationPage } from './reservation.page';

import { TranslateModule } from '@ngx-translate/core';

import {ReservationPageModal} from './modal-reservation.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationPageRoutingModule,
    TranslateModule
  ],
  declarations: [ReservationPage,ReservationPageModal]
})
export class ReservationPageModule {}
