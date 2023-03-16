import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderedStep3Page } from './ordered-step3.page';

const routes: Routes = [
  {
    path: '',
    component: OrderedStep3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderedStep3PageRoutingModule {}
