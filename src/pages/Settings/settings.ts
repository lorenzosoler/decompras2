import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../providers/user-service";
import { User } from "../../models/user";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public currentUser: User;
  public idioma: string;

  constructor(private translate: TranslateService,
              private userService: UserService) {

    this.currentUser = this.userService.getCurrentUser();
    this.idioma = this.translate.currentLang;
  }

  public changeIdioma () {
      this.translate.use(this.idioma);
  }

}