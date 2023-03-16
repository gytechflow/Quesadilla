import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotAvailablePage } from './not-available.page';

const routes: Routes = [
  {
    path: '',
    component: NotAvailablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotAvailablePageRoutingModule {}
