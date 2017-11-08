import { NavController, Platform } from 'ionic-angular';
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
              private platform: Platform,
              private userService: UserService) {

    this.currentUser = this.userService.getCurrentUser();
    this.idioma = this.translate.currentLang;
    this.platform.registerBackButtonAction(() => {
      if (this.navCtrl.getActive().name == 'SettingsPage'){
        this.navCtrl.setRoot(MisListasPage);
      } else if (this.navCtrl.getActive().name == 'MisListasPage') {
        this.platform.exitApp();
      } else {
        this.navCtrl.pop();
      }
    })
  }

  public changeIdioma () {
      this.storage.set("lang", this.idioma);
      this.translate.use(this.idioma);
  }

  public goAboutPage() {
    this.navCtrl.push(AboutPage);
  }

}