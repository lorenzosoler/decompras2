import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { Platform } from 'ionic-angular';
import { Facebook } from "@ionic-native/facebook";

import firebase from 'firebase';
import { GooglePlus } from "@ionic-native/google-plus";

@Injectable()
export class AuthService {

  constructor(public platform: Platform, 
  public facebook:Facebook,
  public af: AngularFireAuth, 
  private google: GooglePlus) {
   }

  logout() {
    return this.af.auth.signOut().then(() => {
      if (this.platform.is('cordova')) {
        this.google.logout();
        this.facebook.logout();
      }
    });
  }

}
