import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckOrderPageRoutingModule } from './check-order-routing.module';

import { CheckOrderPage } from './check-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckOrderPageRoutingModule
  ],
  declarations: [CheckOrderPage]
})
export class CheckOrderPageModule {}
