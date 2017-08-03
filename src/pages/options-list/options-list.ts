import { ViewController, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { UsersListPage } from "../users-list/users-list";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'page-options-list',
  template: `
    <ion-list no-lines no-padding no-margin>
      <button ion-item (click)="verMiembros()">{{"VERMIEMBROS" | translate}}</button>
      <button ion-item (click)="addUser()">{{"ADDUSER" | translate}}</button>
      <button ion-item (click)="orderByPrice()">{{"ORDENAR" | translate}}</button>
      <button ion-item (click)="descuento()">{{"APLICAR" | translate}} {{ "DESCUENTO" | translate}}</button>
    </ion-list>
  `
})

export class OptionsListPage {
  currentList: any;

  constructor(public viewCtrl: ViewController, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
      this.currentList = this.navParams.get('currentList');
  }

  verMiembros() {
    this.viewCtrl.dismiss('showUsers');
  }

  addUser() {
    this.viewCtrl.dismiss('addUser');
  }

  orderByPrice() {
    this.viewCtrl.dismiss("orderByPrice");
  }

  descuento() {
    this.viewCtrl.dismiss("descuento")
  }
}