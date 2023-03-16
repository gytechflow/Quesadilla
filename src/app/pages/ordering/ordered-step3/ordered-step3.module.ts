import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { OrderedStep3PageRoutingModule } from './ordered-step3-routing.module';

import { OrderedStep3Page } from './ordered-step3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    OrderedStep3PageRoutingModule
  ],
  declarations: [OrderedStep3Page]
})
export class OrderedStep3PageModule {}
