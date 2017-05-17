import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer, ModalController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { UserService } from "../../providers/user-service";
import { Lista } from "../../models/lista";
import { AddListPage } from "../add-list/add-list";

@Component({
  selector: 'page-mis-listas',
  templateUrl: 'mis-listas.html'
})
export class MisListasPage {
  @ViewChild(Content) content: Content;
  private currentUser: User;
  private myLists: Array<Lista> = [];

  constructor(
  public navCtrl: NavController,
  public modalCtrl: ModalController, 
  public userService: UserService) {
  }

  ionViewDidLoad() {
    this.currentUser = this.userService.getCurrentUser();
  }

  public addList(fab?: FabContainer) {
    let that = this;
    let addListModal = this.modalCtrl.create(AddListPage, {}, { enableBackdropDismiss: false });

    // Si se realizo una publicacion, cuando se cierra el modal, se agrega el post al principio de la lista
    addListModal.onDidDismiss((list) => {
      if (list) {
        that.myLists.unshift(list);
        that.content.scrollToTop();
      }
    });

    addListModal.present().then(() => {
      if (fab) {
        fab.close();
      }
    });
  }

}
