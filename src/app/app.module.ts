import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//==============FIREBASE=====================
import{AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, NgApexchartsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
