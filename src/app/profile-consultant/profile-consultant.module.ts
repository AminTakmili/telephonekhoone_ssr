import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModulePageModule } from "../module/share-module/share-module.module";

import { IonicModule } from "@ionic/angular";

import { ProfileConsultantPageRoutingModule } from "./profile-consultant-routing.module";
import { ProfileConsultantPage } from "./profile-consultant.page";
import { EditinfoComponent } from "./editinfo/editinfo.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { WithdrawComponent } from "./withdraw/withdraw.component";
import { MycallsComponent } from "./mycalls/mycalls.component";
import { ActivitiesStatusComponent } from "./activities-status/activities-status.component";
import { TransactionsConsultantComponent } from "./transactions/transactions.component";
import { PlanDetailComponent } from "../components/plan-detail/plan-detail.component";
import { WebinarComponent } from './webinar/webinar.component';
import { MediaComponent } from './media/media.component';
import { NewMediaComponent } from './media/new-media/new-media.component';
import { ArchiveComponent } from './media/archive/archive.component';
import { HistoryComponent } from './withdraw/history/history.component';
import { MimeTypeIconPipe } from "../pipes/file-type.pipe";

//! import { LongPressModule } from "ionic-long-press";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileConsultantPageRoutingModule,
    ShareModulePageModule,
    ReactiveFormsModule,
    //! LongPressModule,
  ],
  declarations: [
    ProfileConsultantPage,
    EditinfoComponent,
    ReservationComponent,
    WithdrawComponent,
    MycallsComponent,
    ActivitiesStatusComponent,
    TransactionsConsultantComponent,
    PlanDetailComponent,
    WebinarComponent,
    MediaComponent,
    NewMediaComponent,
    ArchiveComponent,
    HistoryComponent
  ],
  // providers:[

  //   MimeTypeIconPipe,


  // ]
})
export class ProfileConsultantPageModule {}
