import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenTimePageRoutingModule } from './open-time-routing.module';

import { OpenTimePage } from './open-time.page';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenTimePageRoutingModule,
    TranslateModule,
    
    
    
  ],
 
 
  declarations: [OpenTimePage]
})
export class OpenTimePageModule {}
