import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareModulePage } from './share-module.page';
import { SurveyComponent } from './survey/survey.component';

const routes: Routes = [
  {
    path: '',
    component: ShareModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareModulePageRoutingModule {}
