import { LottieModule } from 'ngx-lottie';
import { AppShellNoRenderDirective } from './directives/app-shell-norender.directive';
import { AppShellRenderDirective } from './directives/app-shell-render.directive';
import { GlobalService } from './services/global.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxStarRatingModule } from 'ngx-star-rating';
import { DecimalPipe } from '@angular/common';
import { PipesModule } from './module/pipes-module/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';

export function playerFactory() {
	return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    IonicModule.forRoot(),
    TransferHttpCacheModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserTransferStateModule,
    LottieModule.forRoot({ player: playerFactory }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    BrowserAnimationsModule,
    IonicStorageModule.forRoot({
      name: '_telephonekhoone',
      driverOrder: [ Drivers.LocalStorage],
    }),
    // LottieModule.forRoot({ player: playerFactory }),
    NgxStarRatingModule,
  ],

  providers: [
    DecimalPipe,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
