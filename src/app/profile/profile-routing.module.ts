import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfilePage } from "./profile.page";
import { EditInfoComponent } from "./edit-info/edit-info.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { WalletComponent } from "./wallet/wallet.component";
import { MyCallsComponent } from "./my-calls/my-calls.component";
import { TransactionsComponent } from "./transactions/transactions.component";
import { FavouritesComponent } from "./favourites/favourites.component";
import { TicketsComponent } from "./tickets/tickets.component";

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  // {
  //   path: "",
  //   redirectTo: "editinfo",
  //   pathMatch: "full",
  // },
  {
    path: "editinfo",
    component: EditInfoComponent,
  },
  {
    path: "reservation",
    component: ReservationComponent,
  },
  {
    path: "wallet",
    component: WalletComponent,
  },
  {
    path: "mycalls",
    component: MyCallsComponent,
  },
  {
    path: "transactions",
    component: TransactionsComponent,
  },
  {
    path: "favourites",
    component: FavouritesComponent,
  },
  {
    path: "tickets",
    component: TicketsComponent,
  },
  {
    path: "tickets/new",
    loadChildren: () =>
      import("./tickets/new/new.module").then((m) => m.NewPageModule),
  },
  {
    path: "tickets/show/:id",
    loadChildren: () =>
      import("./tickets/show/show.module").then((m) => m.ShowPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
