import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegistryPage } from '../pages/registry/registry';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { VehiclePage } from '../pages/vehicle/vehicle';
import { ServicePage } from '../pages/service/service';
import { RememberPage } from '../pages/remember/remember';
import { SoatPage } from '../pages/soat/soat';
import { TaxPage } from '../pages/tax/tax';
import { WslidePage } from '../pages/wslide/wslide';
//import { VehiclePipe } from './pipes/vehiclepipe.pipe';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate/ng2-translate';
import { BrowserModule } from '@angular/platform-browser';
//import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistryPage,
    DashboardPage,
    VehiclePage,
    ServicePage,
    RememberPage,
    //VehiclePipe, 
    SoatPage,
    TaxPage,  
    WslidePage,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistryPage,
    DashboardPage,
    ServicePage,  
    VehiclePage,
    RememberPage,
    SoatPage,
    TaxPage,
    WslidePage,
      
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, InAppBrowser]
})
export class AppModule {}
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

