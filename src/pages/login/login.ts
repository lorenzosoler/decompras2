import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, AlertController } from 'ionic-angular';

import { Facebook } from "@ionic-native/facebook";

import firebase from 'firebase';
import { User } from "../../models/user";
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth, AUTH_PROVIDERS } from "angularfire2/auth";
import { MisListasPage } from "../mis-listas/mis-listas";
import { UserService } from "../../providers/user-service";
import { GooglePlus } from "@ionic-native/google-plus";
import { AuthService } from "../../providers/auth-service";
import { TranslateService } from "@ngx-translate/core";
import { AndroidFullScreen } from "@ionic-native/android-full-screen";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  currentUser: User = null;
  loader: any;

  constructor(private platform:Platform, 
    private navCtrl: NavController,
    public loadingCtrl: LoadingController,
    private af:AngularFireDatabase, 
    private afauth:AngularFireAuth,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public authService: AuthService,
    private androidFullScreen: AndroidFullScreen,
    public userService:UserService) {

  }

  ionViewDidLoad () {
    this.translate.get(["CARGANDO"]).subscribe((data) => {
      this.loader = this.loadingCtrl.create(
        {
          content: data.CARGANDO
        }
      );
    })
  }

  ionViewWillEnter () {
    this.androidFullScreen.immersiveMode();
  }

  ionViewWillLeave () {
    this.androidFullScreen.showSystemUI();
  }
  
  public facebookLogin(): void {
    this.loader.present();
    if (this.platform.is('cordova')) {   
      this.facebook.login(['public_profile', 'user_friends', 'email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        var auth = firebase.auth();
        auth.signInWithCredential(facebookCredential)
        .then((success) => {
          this.userService.saveUser(new User(success)).then(()=> {
            this.loader.dismiss();
            this.navCtrl.setRoot(MisListasPage);
          }).catch((e) => {
            this.loader.dismiss();
            console.log(e);
          });
        })
        .catch((error: any) => {
          // An error happened.
          if (error.code === 'auth/account-exists-with-different-credential') {
            this.translate.get(["MAILREPETIDO", "ASOCIAR", "CANCELAR"]).subscribe((data) => {
              let prompt = this.alertCtrl.create({
                title: '',
                message: data.MAILREPETIDO,
                buttons: [
                  {
                    text: data.CANCELAR,
                    handler: () => {
                      this.loader.dismiss();
                    }
                  },
                  {
                    text: data.ASOCIAR,
                    handler: () => {
                      this.asociar(error);
                    }
                  }
                ]
              });
              prompt.present();
            })
          }
        });
      }).catch((error) => { this.loader.dismiss(); console.log(error); });
    } else {
      var auth = firebase.auth();
      auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((user) => {
        this.userService.saveUser(new User(user.user)).then(()=> {
          this.loader.dismiss();
          this.navCtrl.setRoot(MisListasPage);
        });
      })
      .catch( (error: any) => {
        // An error happened.
        if (error.code === 'auth/account-exists-with-different-credential') {
          var pendingCred = error.credential;
          // The provider account's email address.
          var email = error.email;
          // Get registered providers for this email.
          auth.fetchProvidersForEmail(email).then( (providers) => {
            auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
              result.user.link(pendingCred).then(() => {
                // Facebook account successfully linked to the existing Firebase user.
                this.userService.saveUser(new User(result.user)).then(()=> {
                  this.loader.dismiss();
                  this.navCtrl.setRoot(MisListasPage);
                });
              });
            });
          });
        }
      });
    }
  }


  private asociar (error: any) {
    var pendingCred = error.credential;
    // The provider account's email address.
    var email = error.email;
    // Get registered providers for this email.
    firebase.auth().fetchProvidersForEmail(email).then( (providers) => {
      this.googlePlus.login({
        'webClientId': '955671816280-untuia24tvidjifk40qj1li0foip7rng.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then((user) => {
          user.link(pendingCred).then(() => {
            // Facebook account successfully linked to the existing Firebase user.
            this.userService.saveUser(new User(user)).then(()=> {
              this.loader.dismiss();
              this.navCtrl.setRoot(MisListasPage);
            });
          });
        });
      });
    });
  }

  public googleLogin(): void {
    this.loader.present();
    if (this.platform.is('cordova')) {
      this.googlePlus.login({
        'webClientId': '955671816280-untuia24tvidjifk40qj1li0foip7rng.apps.googleusercontent.com',
        'offline': true
      }).then( res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then( success => {
            this.userService.saveUser(new User(success)).then(()=> {
              this.loader.dismiss();
              this.navCtrl.setRoot(MisListasPage);
            });
          })
          .catch( (error) => { 
            console.log("Firebase failure: " + JSON.stringify(error));
            this.loader.dismiss();
          });
        }).catch((err) => {
          console.error("Error: ", err);
          this.loader.dismiss();
        });
    } else{
      this.afauth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((user) => {
        this.userService.saveUser(new User(user.auth)).then(()=> {
          this.loader.dismiss();
          this.navCtrl.setRoot(MisListasPage);
        });
      }).catch(error=>{
        this.loader.dismiss();
        console.log(error)
      })
    }
  }
}

