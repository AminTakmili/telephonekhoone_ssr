import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebinarPage } from './webinar.page';
import { ShowComponent } from './show/show.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
	{
		path: '',
		component: WebinarPage
	},
	{
		path: ':id',
		component: ShowComponent
	},
	{
		path: 'categories/:id',
		component: CategoriesComponent
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class WebinarPageRoutingModule { }
