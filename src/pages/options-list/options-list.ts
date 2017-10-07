import { ViewController, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { UsersListPage } from "../users-list/users-list";
import { TranslateService } from "@ngx-translate/core";
import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";

@Component({
  selector: 'page-options-list',
  template: `
    <ion-list no-lines padding-top padding-bottom no-margin>
      <button id="uno" ion-item (click)="verMiembros()">{{"VERMIEMBROS" | translate}}</button>
      <button id="dos" ion-item (click)="orderByPrice()">{{"ORDENAR" | translate}}</button>
      <button id="tres" ion-item (click)="descuento()">{{"APLICAR" | translate}} {{ "DESCUENTO" | translate}}</button>
    </ion-list>
  `
})

export class OptionsListPage {
  currentList: any;
  currentUser: User;

  constructor(public viewCtrl: ViewController, 
  public translate: TranslateService, 
  public navCtrl: NavController, 
  public navParams: NavParams,
  public listService: ListService) {
      this.currentList = this.navParams.get('currentList');
      this.currentUser = this.navParams.get('currentUser');
  }

  verMiembros() {
    this.viewCtrl.dismiss('showUsers');
  }

  orderByPrice() {
    this.viewCtrl.dismiss("orderByPrice");
  }

  descuento() {
    this.viewCtrl.dismiss("descuento")
  }
}