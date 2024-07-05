import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchTarjetasPage } from './search-tarjetas.page';

const routes: Routes = [
  {
    path: '',
    component: SearchTarjetasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchTarjetasPageRoutingModule {}
