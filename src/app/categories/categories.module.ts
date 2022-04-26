import { LottieModule } from 'ngx-lottie';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriesPageRoutingModule } from './categories-routing.module';

import { CategoriesPage } from './categories.page';
import { ShareModulePageModule } from '../module/share-module/share-module.module';

// import { StarRatingModule } from 'ionic5-star-rating';
// import { IonicRatingModule } from 'ionic-rating-component';


import { TimelineComponent } from '../components/timeline/timeline.component';

// import { SearchComponent } from './search/search.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule,
    ShareModulePageModule,
    ReactiveFormsModule,
    LottieModule,
    // AnimationLoader,
    // StarRatingModule,
    // IonicRatingModule,
  ],
  declarations: [
    CategoriesPage,
    // SearchComponent,
    // DrProfileComponent,
    TimelineComponent,
    // NewChatComponent,
  ]
})
export class CategoriesPageModule {}
