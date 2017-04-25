import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public authService: AuthService) {

  }

  public logout() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
