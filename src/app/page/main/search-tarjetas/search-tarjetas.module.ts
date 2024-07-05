import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchTarjetasPageRoutingModule } from './search-tarjetas-routing.module';

import { SearchTarjetasPage } from './search-tarjetas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchTarjetasPageRoutingModule
  ],
  declarations: [SearchTarjetasPage]
})
export class SearchTarjetasPageModule {}
