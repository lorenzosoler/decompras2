import { NavController } from 'ionic-angular';
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../providers/user-service";
import { User } from "../../models/user";
import { AboutPage } from "../about/about";
import { Storage } from '@ionic/storage';
import { MisListasPage } from "../mis-listas/mis-listas";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public currentUser: User;
  public idioma: string;

  constructor(private translate: TranslateService,
              public navCtrl: NavController,
              private storage: Storage,
              private userService: UserService) {

    this.currentUser = this.userService.getCurrentUser();
    this.idioma = this.translate.currentLang;
  }

  public changeIdioma () {
      this.storage.set("lang", this.idioma);
      this.translate.use(this.idioma);
  }

  public goAboutPage() {
    this.navCtrl.push(AboutPage);
  }

}