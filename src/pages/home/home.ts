import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public authService: AuthService) {

  }

  public logout() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
