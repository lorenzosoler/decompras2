import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer, ModalController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { UserService } from "../../providers/user-service";
import { AddListPage } from "../add-list/add-list";
import { ListService } from "../../providers/list-service";
import { FirebaseListObservable } from "angularfire2";
import { ListaPage } from "../lista/lista";

@Component({
  selector: 'page-mis-listas',
  templateUrl: 'mis-listas.html'
})
export class MisListasPage {
  @ViewChild(Content) content: Content;
  private currentUser: User;
  private myLists: any[] = [];

  constructor(
  public navCtrl: NavController,
  public modalCtrl: ModalController,
  public listService: ListService,
  public userService: UserService) {
  }

  ionViewDidLoad() {
    this.currentUser = this.userService.getCurrentUser();
    this.listService.getLists().subscribe(lists => {
       this.myLists = lists;
    });
  }

  public addList() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddListPage, {}, { enableBackdropDismiss: false });

    // Si se realizo una publicacion, cuando se cierra el modal, se agrega el post al principio de la lista
    addListModal.onDidDismiss(list => {
      if (list) {
        that.content.scrollToTop();
      }
    });

    addListModal.present();
  }

  public openList(list: any) {
    this.navCtrl.push(ListaPage, {currentList: list});
  }

}
