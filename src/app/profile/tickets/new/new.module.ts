import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { NewPageRoutingModule } from "./new-routing.module";

import { NewPage } from "./new.page";
import { ShareModulePageModule } from "src/app/module/share-module/share-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPageRoutingModule,
    ShareModulePageModule,
    ReactiveFormsModule
  ],
  declarations: [NewPage],
})
export class NewPageModule {}
