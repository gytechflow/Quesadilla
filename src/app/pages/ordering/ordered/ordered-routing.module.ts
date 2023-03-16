import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderedPage } from './ordered.page';

const routes: Routes = [
  {
    path: '',
    component: OrderedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderedPageRoutingModule {}
