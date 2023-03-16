import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderedStep2Page } from './ordered-step2.page';

const routes: Routes = [
  {
    path: '',
    component: OrderedStep2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderedStep2PageRoutingModule {}
