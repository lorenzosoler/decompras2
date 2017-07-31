import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';
import { HttpModule, Http, JsonpModule } from '@angular/http';

import { AddListPage } from '../pages/add-list/add-list';
import { LoginPage } from '../pages/login/login';
import { MisListasPage } from "../pages/mis-listas/mis-listas";
import { AddItemPage } from "../pages/add-item/add-item";
import { ListaPage } from "../pages/lista/lista";
import { UsersListPage } from "../pages/users-list/users-list";
import { AddUserPage } from "../pages/add-user/add-user";
import { SettingsPage } from "../pages/Settings/settings";
import { EditListPage } from "../pages/edit-list/edit-list";

import { AuthService } from '../providers/auth-service';
import { UserService } from "../providers/user-service";
import { ListService } from "../providers/list-service";
import { NetworkService } from "../providers/network-service";
import { NotificationsService } from '../providers/notifications-service';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from "@ionic-native/facebook";
import { Network } from "@ionic-native/network";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { OneSignal } from "@ionic-native/onesignal";
import { Calendar } from '@ionic-native/calendar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Globalization } from '@ionic-native/globalization';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GooglePlus } from '@ionic-native/google-plus';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    MisListasPage,
    ListaPage,
    AddItemPage,
    UsersListPage,
    AddUserPage,
    SettingsPage,
    EditListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddListPage,
    LoginPage,
    MisListasPage,
    ListaPage,
    AddItemPage,
    UsersListPage,
    AddUserPage,
    SettingsPage,
    EditListPage
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
    NotificationsService,
    LocalNotifications,
    OneSignal,
    Calendar,
    SpeechRecognition,
	  Globalization,
    SocialSharing,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
