import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

import { WebinarPageRoutingModule } from './webinar-routing.module';

import { WebinarPage } from './webinar.page';
import { ShowComponent } from './show/show.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebinarPageRoutingModule,
	ShareModulePageModule,
	NgxPaginationModule
  ],
  declarations: [
    WebinarPage,
    ShowComponent,
	CategoriesComponent
  ]
})
export class WebinarPageModule {}
