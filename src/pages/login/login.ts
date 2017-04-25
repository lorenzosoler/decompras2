import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { HomePage } from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  users: FirebaseListObservable<any[]>;

  constructor(private navCtrl: NavController,af: AngularFire,private authService: AuthService) {
    this.users = af.database.list('/users');
  }
  
  login() {
    this.authService.signInWithFacebook().then((data) => {
      this.navCtrl.setRoot(HomePage);
    })
  }

}