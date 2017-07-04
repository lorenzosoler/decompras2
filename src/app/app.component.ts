import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav, MenuController } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  currentUser: User;

  pages: PageObj[] = [
    { title: 'Mis Listas', component: MisListasPage, icon: 'clipboard' }
  ];

  constructor(platform: Platform, 
  private statusBar: StatusBar, 
  private splashScreen: SplashScreen,
  private oneSignal: OneSignal,
  private localNotifications: LocalNotifications,
  private menuCtrl: MenuController,
  private authService:AuthService,
  public userService: UserService,
  public networkService: NetworkService) {
    platform.ready().then(() => {
      this.checkAuthUser();

      if(platform.is('cordova')) {
          // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.oneSignal.startInit('8e4f03e5-8ffb-4fb8-9dd8-7136c5156202', '955671816280');

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

        this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        });

        this.oneSignal.handleNotificationOpened().subscribe(() => {
          alert('Notificacion')
        });

        this.oneSignal.endInit();

        this.localNotifications.on("click", (notification, state) => {
          let data = JSON.parse(notification.data);
          this.nav.push(data.list);
        });

      }

      statusBar.styleDefault();

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
        this.nav.setRoot(MisListasPage);
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
