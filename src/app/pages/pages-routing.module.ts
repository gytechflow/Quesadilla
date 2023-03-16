import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },
  {
    path: 'coupons',
    loadChildren: () => import('./coupons/coupons.module').then( m => m.CouponsPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'myorders',
    loadChildren: () => import('./myorders/myorders.module').then( m => m.MyordersPageModule)
  },
  {
    path: 'refer',
    loadChildren: () => import('./refer/refer.module').then( m => m.ReferPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
