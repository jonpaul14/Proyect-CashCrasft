import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiginUpPage } from './sigin-up.page';

const routes: Routes = [
  {
    path: '',
    component: SiginUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiginUpPageRoutingModule {}
