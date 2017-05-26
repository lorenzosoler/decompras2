import { Component } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';

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
  public loadingCtrl: LoadingController,
  private af:AngularFire, 
  private facebook: Facebook,
  public userService:UserService) {
  }
  
  facebookLogin(): void {
    let loader = this.loadingCtrl.create({
        content: 'Autenticando...'
    });
    if (this.platform.is('cordova')) {
      this.facebook.login(['public_profile', 'user_friends', 'email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          loader.present();
          this.userService.saveUser(new User(success)).then(()=> {
            loader.dismiss();
            this.navCtrl.setRoot(MisListasPage);
          });
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
        loader.present();
        this.userService.saveUser(new User(user.auth)).then(()=> {
          loader.dismiss();
          this.navCtrl.setRoot(MisListasPage);
        });
      }).catch(error=>{
        alert("No hay conexion a internet, intente mas tarde");
      })
    }
  }
}

