import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	HelpPageRoutingModule,
	ShareModulePageModule
  ],
  declarations: [HelpPage]
})
export class HelpPageModule {}
