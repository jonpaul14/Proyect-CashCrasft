import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { LogoComponent } from './component/logo/logo.component';
import { CustomInputComponent } from './component/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateTarjetaComponent } from './component/add-update-tarjeta/add-update-tarjeta.component';
import { AddUpdateGastoComponent } from './component/add-update-gasto/add-update-gasto.component';
import { SearchTarjetasComponent } from './component/search-tarjetas/search-tarjetas.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    AddUpdateTarjetaComponent,
    AddUpdateGastoComponent,
    SearchTarjetasComponent
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    AddUpdateTarjetaComponent,
    AddUpdateGastoComponent,
    SearchTarjetasComponent,
  
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
