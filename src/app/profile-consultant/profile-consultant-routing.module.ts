import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfileConsultantPage } from "./profile-consultant.page";
import { EditinfoComponent } from "./editinfo/editinfo.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { MycallsComponent } from "./mycalls/mycalls.component";
import { ActivitiesStatusComponent } from "./activities-status/activities-status.component";
import { TransactionsComponent } from '../profile/transactions/transactions.component';
import { TransactionsConsultantComponent } from './transactions/transactions.component';
import { WebinarComponent } from './webinar/webinar.component';
import { MediaComponent } from './media/media.component';
import { NewMediaComponent } from './media/new-media/new-media.component';
import { ArchiveComponent } from './media/archive/archive.component';
import { HistoryComponent } from './withdraw/history/history.component';

const routes: Routes = [
	{
		path: '',
		component: ProfileConsultantPage
	},
	// {
	//   path: "",
	//   redirectTo: "editinfo",
	//   pathMatch: "full",
	// },
	{
		path: "editinfo",
		component: EditinfoComponent,
	},
	{
		path: "reservation",
		component: ReservationComponent,
	},
	{
		path: "withdraw",
		component: WithdrawComponent,
	},
	{
		path: "withdraw/history",
		component: HistoryComponent,
	},
	{
		path: "mycalls",
		component: MycallsComponent,
	},
	{
		path: "status",
		component: ActivitiesStatusComponent,
	},
	{
		path: "transactions",
		component: TransactionsConsultantComponent,
	},
	{
		path: "webinar",
		component: WebinarComponent,
	},
	{
		path: "media",
		component: MediaComponent,
		children: [
			{
				path: '',
				redirectTo: 'archive',
				pathMatch: 'full',
				
			},
			{
				path: "archive",
				component: ArchiveComponent
			},
			{
				path: "new",
				component: NewMediaComponent
			},
			{
				path: "edit/:id",
				component: NewMediaComponent
			}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProfileConsultantPageRoutingModule { }
