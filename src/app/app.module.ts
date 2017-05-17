import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';

import { AddListPage } from '../pages/add-list/add-list';
import { LoginPage } from '../pages/login/login';
import { MisListasPage } from "../pages/mis-listas/mis-listas";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from "@ionic-native/facebook";
import { AuthService } from '../providers/auth-service';
import { UserService } from "../providers/user-service";
import { ListService } from "../providers/list-service";
import { NetworkService } from "../providers/network-service";
import { Network } from "@ionic-native/network";

export const firebaseConfig = {
    apiKey: "AIzaSyCApY3KncwgAc-9eHhwdw1_XoBfubdCVWM",
    authDomain: "de-compras-b2bfc.firebaseapp.com",
    databaseURL: "https://de-compras-b2bfc.firebaseio.com",
    projectId: "de-compras-b2bfc",
    storageBucket: "de-compras-b2bfc.appspot.com",
    messagingSenderId: "955671816280"
  };

@NgModule({
  declarations: [
    MyApp,
    AddListPage,
    LoginPage,
    MisListasPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddListPage,
    LoginPage,
    MisListasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Facebook,
    AuthService,
    UserService,
    ListService,
    NetworkService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
