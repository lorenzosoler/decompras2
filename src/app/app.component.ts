import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AuthService } from "../providers/auth-service";
import { LoginPage } from "../pages/login/login";
import { User } from "../models/user";
import { PageObj } from "./page-object";
import { MisListasPage } from "../pages/mis-listas/mis-listas";

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  currentUser: User;

  pages: PageObj[] = [
    { title: 'Mis Listas', component: MisListasPage, icon: 'megaphone' }
  ];

  constructor(platform: Platform, 
  private statusBar: StatusBar, 
  private splashScreen: SplashScreen, 
  private menuCtrl: MenuController,
  private authService:AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          this.currentUser = new User(user);
          this.nav.setRoot(MisListasPage, {currentUser: this.currentUser});
        } else {
          this.currentUser = user;
          this.nav.setRoot(LoginPage);
        }
      })
    });
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
