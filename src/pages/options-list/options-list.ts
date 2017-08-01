import { ViewController, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { UsersListPage } from "../users-list/users-list";

@Component({
  selector: 'page-options-list',
  template: `
    <ion-list no-lines no-padding no-margin>
      <button ion-item (click)="close()">Ordenar por precio</button>
      <button ion-item (click)="verMiembros()">Ver miembros</button>
      <button ion-item (click)="addUser()">Agregar miembro</button>
    </ion-list>
  `
})

export class OptionsListPage {
  currentList: any;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
      this.currentList = this.navParams.get('currentList');
  }

  verMiembros() {
    this.viewCtrl.dismiss('showUsers');
  }

  addUser() {
    this.viewCtrl.dismiss('addUser');
  }
}