import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { UserService } from "../../providers/user-service";

@Component({
  selector: 'page-mis-listas',
  templateUrl: 'mis-listas.html'
})
export class MisListasPage {
  @ViewChild(Content) content: Content;
  private currentUser: User;

  constructor(public navCtrl: NavController, public userService: UserService) {
  }

  ionViewDidLoad() {
    this.currentUser = this.userService.getCurrentUser();
  }

}
