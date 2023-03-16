import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyordersPageRoutingModule } from './myorders-routing.module';

import { MyordersPage } from './myorders.page';
import { OrderedPageModal } from './modal-myorders.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MyordersPageRoutingModule
  ],
  declarations: [MyordersPage, OrderedPageModal]
})
export class MyordersPageModule {}
