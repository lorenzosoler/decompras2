import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { Facebook } from "@ionic-native/facebook";

import firebase from 'firebase';
import { User } from "../../models/user";
import { AngularFire, AuthProviders, AuthMethods } from "angularfire2";
import { MisListasPage } from "../mis-listas/mis-listas";
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  currentUser: User = null;

  constructor(private platform:Platform, 
  private navCtrl: NavController,
  private af:AngularFire, 
  private facebook: Facebook,
  public userService:UserService) {
  }
  
  facebookLogin(): void {
    if (this.platform.is('cordova')) {
      this.facebook.login(['public_profile','email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.currentUser = new User(success);
            this.userService.saveUser(this.currentUser);
            this.navCtrl.setRoot(MisListasPage, {currentUser: this.currentUser});
          })
          .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
        });

      }).catch((error) => { console.log(error) });
    } else {
      this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      }).then((user) => {
        this.currentUser = new User(user.auth);
        this.userService.saveUser(this.currentUser);
        this.navCtrl.setRoot(MisListasPage, {currentUser: this.currentUser});
      });
    }
  }
}

