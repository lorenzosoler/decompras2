import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from "../providers/auth-service";
import { LoginPage } from "../pages/login/login";
import { User } from "../models/user";
import { PageObj } from "./page-object";
import { MisListasPage } from "../pages/mis-listas/mis-listas";

import firebase from 'firebase';
import { UserService } from "../providers/user-service";
import { NetworkService } from "../providers/network-service";
import { OneSignal, OSNotification } from "@ionic-native/onesignal";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { ListaPage } from "../pages/lista/lista";
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '@ngx-translate/core';
import { SettingsPage } from "../pages/Settings/settings";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  currentUser: User;
  isNotif: boolean = false;

  pages: PageObj[] = [
    { title: 'Mis Listas', component: MisListasPage, icon: 'clipboard' },
    { title: 'Ajustes', component: SettingsPage, icon: 'settings' }
  ];

  constructor(platform: Platform,
  private translate: TranslateService,
  private statusBar: StatusBar, 
  private splashScreen: SplashScreen,
  private oneSignal: OneSignal,
  private localNotifications: LocalNotifications,
  private globalization: Globalization,
  private menuCtrl: MenuController,
  private authService:AuthService,
  public userService: UserService,
  public networkService: NetworkService) {
    //se setea el lenguaje de la app
    this.translate.setDefaultLang('en');

    platform.ready().then(() => {
      this.checkAuthUser();

      if(platform.is('cordova')) {

        // Se obtiene el lenguaje del telefono
        this.globalization.getPreferredLanguage()
        .then((res) => {
          let lang = res.value.substr(0,2);
          // Se setea el lenguaje de la app con el lenguaje que tiene configurado el celular
          this.translate.use(lang);
        })
        .catch(e => console.log(e));

          // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.oneSignal.startInit('8e4f03e5-8ffb-4fb8-9dd8-7136c5156202', '955671816280');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.localNotifications.on("click", (notification, state) => {
          let data = JSON.parse(notification.data);
          this.isNotif = true;
          this.nav.push(ListaPage, {currentList: data.list});
        });

        this.oneSignal.handleNotificationOpened().subscribe((data) => {
          let list = data.notification.payload.additionalData.list;
          this.isNotif = true;
          this.nav.push(ListaPage, {currentList: list});
        });

        this.oneSignal.endInit();

      }

      this.statusBar.backgroundColorByName('blue');

      this.networkService.watchConnectivity();
      
      splashScreen.hide();

    });
  }

  public checkAuthUser() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        let currentUser = new User(user);
        this.oneSignal.sendTag('userId', currentUser.uid);
        this.userService.serCurrentUser(currentUser);
        this.currentUser = currentUser;
        if (!this.isNotif) {
          this.nav.setRoot(MisListasPage);
        }
      } else {
        this.oneSignal.deleteTag('userId');
        this.nav.setRoot(LoginPage);
      }
    })
  }

  public openPage(page) {
    this.nav.setRoot(page.component);
  }

  public logout() {
    this.authService.logout();
    this.openPage({ component: LoginPage });
    this.menuCtrl.close();
  }
}
