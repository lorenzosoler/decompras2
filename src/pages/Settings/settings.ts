import {NavController} from 'ionic-angular';
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../providers/user-service";
import { User } from "../../models/user";
import { AboutPage } from "../about/about";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public currentUser: User;
  public idioma: string;

  constructor(private translate: TranslateService,
              public navCtrl: NavController,
              private userService: UserService) {

    this.currentUser = this.userService.getCurrentUser();
    this.idioma = this.translate.currentLang;
  }

  public changeIdioma () {
      this.translate.use(this.idioma);
  }

  public goAboutPage() {
    this.navCtrl.push(AboutPage);
  }

}