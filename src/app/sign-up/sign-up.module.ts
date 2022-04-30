import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { ShareModulePageModule } from "../module/share-module/share-module.module";

import { SignUpPageRoutingModule } from "./sign-up-routing.module";

import { SignUpPage } from "./sign-up.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    ShareModulePageModule,
    ReactiveFormsModule
  ],
  declarations: [SignUpPage],
})
export class SignUpPageModule {}
