import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckOrderPage } from './check-order.page';

const routes: Routes = [
  {
    path: '',
    component: CheckOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckOrderPageRoutingModule {}
