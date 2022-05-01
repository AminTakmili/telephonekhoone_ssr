import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ReservationComponent } from './reservation/reservation.component';
import { WalletComponent } from './wallet/wallet.component';
import { MyCallsComponent } from './my-calls/my-calls.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ShareModulePageModule,
    ReactiveFormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ProfilePage,
    EditInfoComponent,
    ReservationComponent,
    WalletComponent,
    MyCallsComponent,
    TicketsComponent,
    TransactionsComponent,
    FavouritesComponent
  ]
})
export class ProfilePageModule {}
