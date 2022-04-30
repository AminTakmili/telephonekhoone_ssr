import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesPage } from './categories.page';
import { ConsultantprofileComponent } from './consultantprofile/consultantprofile.component';
import { SubCategoriListComponent } from './sub-categori-list/sub-categori-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPage
  },
  {
    path: ':catId',
    component: CategoriesPage
  },
  {
    path: 'm/:subCatId',
    component: SubCategoriListComponent
  },
  {
    path: 'm/:subCatId/:consultantId',
    component: ConsultantprofileComponent
  },
  	//   {
	// 	path: '/c',//همه دسته بندی های مشاوران
	// 	component: RulesPage
	//   },
	//   {
	// 	path: '/c/:category_id',//زیر دسته یک دسته بندی 
	// 	component: RulesPage
	//   },
	//   {
	// 	path: '/c/m/:sub_category_id',//لیست مشاوران یک دسته بندی
	// 	component: RulesPage
	//   },
	//   {
	// 	path: '/c/m/:category_id/:advisor_id', // جزییات یک  مشاور 
	// 	component: RulesPage
	//   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesPageRoutingModule {}
