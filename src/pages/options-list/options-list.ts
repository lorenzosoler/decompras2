import { ViewController, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { UsersListPage } from "../users-list/users-list";
import { TranslateService } from "@ngx-translate/core";
import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";

@Component({
  selector: 'page-options-list',
  template: `
    <ion-list no-lines no-padding no-margin>
      <button ion-item (click)="verMiembros()">{{"VERMIEMBROS" | translate}}</button>
      <button ion-item *ngIf="isAdmin()" (click)="addUser()">{{"ADDUSER" | translate}}</button>
      <button ion-item (click)="orderByPrice()">{{"ORDENAR" | translate}}</button>
      <button ion-item (click)="descuento()">{{"APLICAR" | translate}} {{ "DESCUENTO" | translate}}</button>
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

  public isAdmin() {
    return this.listService.isAdmin(this.currentList, this.currentUser.uid);
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