import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuthState, AuthMethods, AngularFire } from 'angularfire2';

import { Platform } from 'ionic-angular';
import { Facebook } from "@ionic-native/facebook";
import { UserInfo } from "firebase";

import firebase from 'firebase';
import { User } from "../models/user";
import { GooglePlus } from "@ionic-native/google-plus";

@Injectable()
export class AuthService {

  constructor(public platform: Platform, public facebook:Facebook, public af: AngularFire, private google: GooglePlus ) { }

  logout() {
    return this.af.auth.logout().then(() => {
      if (this.platform.is('cordova')) {
        this.google.logout();
        this.facebook.logout();
      }
    });
  }

}
