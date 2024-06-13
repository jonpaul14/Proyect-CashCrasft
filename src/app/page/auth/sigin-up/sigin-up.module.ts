import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiginUpPageRoutingModule } from './sigin-up-routing.module';

import { SiginUpPage } from './sigin-up.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiginUpPageRoutingModule,
    SharedModule
  ],
  declarations: [SiginUpPage]
})
export class SiginUpPageModule {}
