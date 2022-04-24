import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';

import { MediaPage } from './media.page';

const routes: Routes = [
	{
		path: '',
		component: MediaPage
	},
	{
		path: ':id',
		component: DetailComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MediaPageRoutingModule { }
