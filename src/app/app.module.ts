import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
// https://github.com/eakoriakin/ionic-select-searchable
import { SelectSearchableModule } from 'ionic-select-searchable';

// Import modules custom
import { ConfiguracionPageModule } from '../pages/configuracion/configuracion.module';
import { AddClientPageModule } from '../pages/configuracion/clients/add/add-client.module';
import { EditClientPageModule } from '../pages/configuracion/clients/edit/edit-client.module';
import { BuysPageModule } from '../pages/configuracion/buys/buys.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatosVentasProvider } from '../providers/datos-ventas/datos-ventas';

import { BillingPage } from '../pages/billing/billing';
import { ClientsPage } from '../pages/configuracion/clients/clients';

import { AuthGuard } from './common/auth.guard';
import { AuthenticationService } from '../providers/authentication.service';
import { AppSettings } from './common/api.path';
import { LoadSettings } from './common/load.settings';
import { CheckinService }  from '../providers/billing/checkin.service';
import { ClientService }  from '../providers/clients/client.service';

import { SearchPipe } from './pipes/search.pipe';
import { LoginPage } from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    BillingPage,
    ClientsPage,

    SearchPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot( MyApp ),
    CommonModule,
    HttpModule,
    // Import Select searchable
    SelectSearchableModule,
    // Import modules custom
    ConfiguracionPageModule,
    AddClientPageModule,
    EditClientPageModule,
    BuysPageModule
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    LoginPage,
    BillingPage,
    ClientsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: APP_INITIALIZER,
      useFactory: LoadSettings,
      deps: [ AppSettings ],
      multi: true
    },
    DatosVentasProvider,
    CheckinService,
    ClientService,
    AppSettings,
    AuthenticationService
  ],
  exports: [
    SearchPipe
  ]
})
export class AppModule {}