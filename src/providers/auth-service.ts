import { Injectable } from '@angular/core';
import { AuthProviders, FirebaseAuthState, AuthMethods, AngularFire } from 'angularfire2';

import { Platform } from 'ionic-angular';
import { Facebook } from "@ionic-native/facebook";
import { UserInfo } from "firebase";

@Injectable()
export class AuthService {

  constructor(public af: AngularFire, public platform: Platform, public facebook:Facebook ) { }

  logout() {
    return this.af.auth.logout();
  }

  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    if (this.platform.is('cordova')) {
        this.facebook.login(['email', 'public_profile', 'user_friends']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      });
    } else {
      return this.af.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      });
    }

  }
}
