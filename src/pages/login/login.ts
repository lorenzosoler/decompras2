import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { AngularFireDatabase, AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { HomePage } from "../home/home";
import { User } from "../../models/user";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private navCtrl: NavController, private af: AngularFire,private authService: AuthService) {
  
  }
  
  login() {
    this.authService.signInWithFacebook().then((data) => {
      this.af.database.object(`/users/${data.uid}`).set(
         new User(data.auth)
      )
      this.navCtrl.setRoot(HomePage);
    })
  }

}