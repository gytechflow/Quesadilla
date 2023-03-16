import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { OrderedStep2PageRoutingModule } from './ordered-step2-routing.module';

import { OrderedStep2Page } from './ordered-step2.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    OrderedStep2PageRoutingModule
  ],
  declarations: [OrderedStep2Page]
})
export class OrderedStep2PageModule {}
