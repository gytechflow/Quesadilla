import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenudetailsPage } from './menudetails.page';

const routes: Routes = [
  {
    path: '',
    component: MenudetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenudetailsPageRoutingModule {}
