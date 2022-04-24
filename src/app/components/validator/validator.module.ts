import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ValidatorComponent } from './validator.component';

@NgModule({
	declarations: [ValidatorComponent],
	imports: [
		IonicModule,
		CommonModule
	],
	exports: [ValidatorComponent]
})
export class ValidatorModule { }
