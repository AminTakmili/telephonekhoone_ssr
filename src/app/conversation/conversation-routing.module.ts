import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesktopGuard } from '../guards/desktop.guard';
import { MobileGuard } from '../guards/mobile.guard';

import { ConversationPage } from './conversation.page';
import { MobileComponent } from './mobile/mobile.component';
import { MobileShowComponent } from './mobile/show/show.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
	{
		path: '',
		component: ConversationPage,
		children: [
			{
				path: 'detail/:chat-id',
				component: ShowComponent,
			},
		],

		canActivate: [DesktopGuard]
	},
	{
		path: 'mobile',
		component: MobileComponent,
		canActivate: [MobileGuard]
	},
	{
		path: 'mobile/detail/:chat-id',
		component: MobileShowComponent,
		canActivate: [MobileGuard]
	},

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ConversationPageRoutingModule { }
