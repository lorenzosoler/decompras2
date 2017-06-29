import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer, ModalController, ActionSheetController, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { UserService } from "../../providers/user-service";
import { AddListPage } from "../add-list/add-list";
import { ListService } from "../../providers/list-service";
import { FirebaseListObservable } from "angularfire2";
import { ListaPage } from "../lista/lista";

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Calendar } from '@ionic-native/calendar';

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
  public alertCtrl: AlertController,
  private localNotifications: LocalNotifications,
  private calendar: Calendar,
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
        let fec = list.date;
        let time = list.hour;
        let date = new Date(fec + ' ' + time);
        this.localNotifications.schedule({
          title: list.name,
          text: 'Fue programada para realizar en este momento',
          icon: 'ic_stat_onesignal_default.png',
          data: {list: list},
          at: date
        });
        let prompt = this.alertCtrl.create({
          title: 'Enlazar con su calendario',
          message: "Agregar esta lista como evento en el calendario?",
          buttons: [
            {
              text: 'No',
              handler: () => {
              }
            },
            {
              text: 'Si',
              handler: () => {
                this.calendar.createEventInteractivelyWithOptions(list.name, 'Argentina', list.detail, date, date).then((msg) => {
                  this.toastCtrl.create({
                      message: 'Se creo evento en el calendario: ' + msg,
                      duration: 3000
                  }).present()
                })
              }
            }
          ]
        });
        prompt.present();
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
