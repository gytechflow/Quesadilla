import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccountPage } from './account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage]
})
export class AccountPageModule {}
