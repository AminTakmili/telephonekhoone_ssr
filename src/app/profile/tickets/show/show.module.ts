import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ShowPageRoutingModule } from "./show-routing.module";

import { ShowPage } from "./show.page";
import { ShareModulePageModule } from "src/app/module/share-module/share-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPageRoutingModule,
    ShareModulePageModule,
  ],
  declarations: [ShowPage],
})
export class ShowPageModule {}
