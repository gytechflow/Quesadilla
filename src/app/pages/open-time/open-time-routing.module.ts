import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenTimePage } from './open-time.page';

const routes: Routes = [
  {
    path: '',
    component: OpenTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenTimePageRoutingModule {}
