import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RulesPageRoutingModule } from './rules-routing.module';

import { RulesPage } from './rules.page';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RulesPageRoutingModule,
		ShareModulePageModule
	],
	declarations: [RulesPage]
})
export class RulesPageModule { }
