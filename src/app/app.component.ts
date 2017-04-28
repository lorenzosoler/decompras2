import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from "../providers/auth-service";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { User } from "../models/user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    currentUser: User;
    pages: any[] = [
      { title: 'Mis Listas', component: HomePage, icon: 'people' }
    ];


  constructor(public authService: AuthService) {
    this.authService.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          console.log("Logged out");
          this.nav.setRoot(LoginPage);
        } else {
          console.log("Logged in");
          this.currentUser = new User(auth.auth);
          this.nav.setRoot(HomePage);
        }
      }
    );
  }

  public openPage(page) {
    this.nav.setRoot(page.component);
  }
}
