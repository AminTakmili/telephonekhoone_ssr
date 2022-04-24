import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MediaPageRoutingModule } from './media-routing.module';

import { MediaPage } from './media.page';
import { ShareModulePageModule } from '../module/share-module/share-module.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DetailComponent } from './detail/detail.component';
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MediaPageRoutingModule,
		ShareModulePageModule,
		NgxPaginationModule,
		FileSaverModule 
	],
	declarations: [
		MediaPage , 
		DetailComponent
	]
})
export class MediaPageModule { }
