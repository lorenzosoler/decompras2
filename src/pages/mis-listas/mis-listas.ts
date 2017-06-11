import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer, ModalController, ActionSheetController, ToastController } from 'ionic-angular';
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
  public showLoader: boolean = false;

  constructor(
  public navCtrl: NavController,
  public modalCtrl: ModalController,
  public actionSheetCtrl: ActionSheetController,
  public toastCtrl: ToastController,
  public listService: ListService,
  public userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ionViewDidLoad() {
    this.showLoader = true;
    this.listService.getLists().subscribe(lists => {
       this.myLists = lists;
       this.showLoader = false;
    });
  }

  public addList() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddListPage, {}, { enableBackdropDismiss: false });

    addListModal.onDidDismiss(list => {
      if (list) {
        that.content.scrollToTop();
      }
    });

    addListModal.present();
  }

  public actionSheet (event, list: any) {
    if (this.currentUser.uid == list.userCreator) {
      this.presentActionSheetUserCreator(event, list);
    } else {
      this.presentActionSheet(event, list);
    }
  }

  public presentActionSheetUserCreator(event, list: any) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: '¿Seguro desea eliminar esta lista? Todos los usuarios que pertenecen a esta lista perderan los datos',
      buttons: [
        {
          text: 'Si, Eliminala',
          icon:'trash',
          role: 'destructive',
          handler: () => {
            this.userService.getUsersByListId(list.$key).subscribe((users) => {
              this.listService.deleteList(list.$key, users).then(() => {
                this.toastCtrl.create({
                    message: 'Lista eliminada correctamente',
                    duration: 3000
                }).present()
              })
            });
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });

    actionSheet.present();
  }

  public presentActionSheet(event, list: any) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: '¿Seguro desea salir de esta lista?',
      buttons: [
        {
          text: 'Si, Salir',
          icon:'trash',
          role: 'destructive',
          handler: () => {
            this.listService.deleteUserList(this.currentUser.uid, list.$key).then(()=> {
                this.toastCtrl.create({
                    message: 'Saliste de la lista',
                    duration: 3000
                }).present()
            })
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });

    actionSheet.present();
  }

  public openList(list: any) {
    this.navCtrl.push(ListaPage, {currentList: list});
  }

}
