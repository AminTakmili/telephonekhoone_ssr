import { MapService } from './../services/map.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPage } from './contact-us.page';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // LeafletModule,
    ContactUsPageRoutingModule,
    ShareModulePageModule,
  ],
  declarations: [ContactUsPage],
  providers:[MapService]
})
export class ContactUsPageModule {}
