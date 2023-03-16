import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderedPageRoutingModule } from './ordered-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { OrderedPage } from './ordered.page';
import { OrderedPageModal } from './modal-ordered.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    OrderedPageRoutingModule  ],
  declarations: [OrderedPage, OrderedPageModal]
})
export class OrderedPageModule {}
