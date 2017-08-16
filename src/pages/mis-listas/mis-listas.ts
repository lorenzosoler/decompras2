import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, FabContainer, ModalController, ActionSheetController, ToastController, AlertController, Platform } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { UserService } from "../../providers/user-service";
import { AddListPage } from "../add-list/add-list";
import { ListService } from "../../providers/list-service";
import { FirebaseListObservable } from "angularfire2/databases";
import { ListaPage } from "../lista/lista";

import { LocalNotifications } from '@ionic-native/local-notifications';
import { Calendar } from '@ionic-native/calendar';
import { OneSignal } from "@ionic-native/onesignal";
import { TranslateService } from "@ngx-translate/core";
import { Globalization } from "@ionic-native/globalization";
import { SocialSharing } from '@ionic-native/social-sharing';
import { EditListPage } from "../edit-list/edit-list";

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
  private platform: Platform,
  private translate: TranslateService,
  private globalization: Globalization,
  private socialSharing: SocialSharing,
  public navCtrl: NavController,
  public modalCtrl: ModalController,
  public alertCtrl: AlertController,
  private localNotifications: LocalNotifications,
  private calendar: Calendar,
  private oneSignal: OneSignal,
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

	public invitPerson () {
	  this.translate.get(["INVITACION"]).subscribe((data) => {
		  this.socialSharing.share(data.INVITACION,'',[], 'www.indigodesign.com.ar');
	  })
	}

  public editList (list: any) {
    let editListModal = this.modalCtrl.create(EditListPage, {currentList: list}, { enableBackdropDismiss: false });

    editListModal.present();

    editListModal.onDidDismiss((oldList, newList) => {
      if (oldList && newList) {
        let newDate;
        if(oldList.date != "") {
          let oldDate = new Date(oldList.date + ' ' + oldList.hour);
          newDate = new Date(newList.date + ' ' + newList.hour); 
          this.calendar.deleteEvent(oldList.name, '', oldList.detail, oldDate, oldDate).then((isDeleted) => {
            if (isDeleted) {
              this.calendar.createEventInteractivelyWithOptions(newList.name, '', newList.detail, newDate, newDate).then((msg) => {
                this.toastCtrl.create({
                    message: "Se edito el evento en el calendario para esta lista" + ': ' + msg,
                    duration: 3000
                }).present();
              })
            }
          }).catch(() => { console.log("no habia evento creado para esta lista")})
        } else {
          newDate = new Date(newList.date + ' ' + newList.hour); 
          this.calendar.createEventInteractivelyWithOptions(newList.name, '', newList.detail, newDate, newDate).then((msg) => {
            this.toastCtrl.create({
                message: "Se edito el evento en el calendario para esta lista" + ': ' + msg,
                duration: 3000
            }).present();
          })
        }
      }
    });

  }

  public addList() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddListPage, {}, { enableBackdropDismiss: false });

    addListModal.onDidDismiss(list => {
      this.translate.get(["RECORDARCALENDARIO", "RECORDATORIOAGREGADO", "SI"]).subscribe((data) => {
        if (list) {
          let date = new Date(list.date + ' ' + list.hour);
          let prompt = this.alertCtrl.create({
            title: '',
            message: data.RECORDARCALENDARIO,
            buttons: [
              {
                text: 'No',
                handler: () => {
                }
              },
              {
                text: data.SI,
                handler: () => {
                  this.calendar.createEventInteractivelyWithOptions(list.name, '', list.detail, date, date).then((msg) => {
                    this.toastCtrl.create({
                        message: data.RECORDATORIOAGREGADO + ': ' + msg,
                        duration: 3000
                    }).present();
                  })
                }
              }
            ]
          });
          prompt.present();
          this.openList(list);
        }
      })
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

  private deleteList (listId: string) {
    this.userService.getUsersByListId(listId).subscribe((users) => {
      this.listService.deleteList(listId, users).then(() => {
        this.translate.get(["LISTAELIMINADA"]).subscribe((data) => {
          this.toastCtrl.create({
              message: data.LISTAELIMINADA,
              duration: 3000
          }).present()
        })
      })
    });
  }

  private showConfirmDelete(listId: string) {
    this.translate.get(["ELIMINARLISTA", "SEGUROELIMINAR", "CANCELAR", "ELIMINAR"]).subscribe((data) => {
      let confirm = this.alertCtrl.create({
        title: data.ELIMINARLISTA,
        message: data.SEGUROELIMINAR,
        buttons: [
          {
            text: data.CANCELAR,
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: data.ELIMINAR,
            handler: () => {
              this.deleteList(listId);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  public presentActionSheetUserCreator(event, list: any) {
    event.stopPropagation();
    this.translate.get(["EDITAR", "ELIMINAR", "CANCELAR"]).subscribe((data) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: data.EDITAR,
            icon: 'create',
            role: 'edit',
            handler: () => { this.editList(list); }
          },
          {
            text: data.ELIMINAR,
            icon:'trash',
            role: 'destructive',
            handler: () => {
              this.showConfirmDelete(list.$key);
            }
          },
          {
            text: data.CANCELAR,
            icon: 'close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      }).present();
    })
  }

  public presentActionSheet(event, list: any) {
    event.stopPropagation();
    this.translate.get(["SALIR", "CANCELAR", "SALISTE"]).subscribe((data) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: data.SALIR,
            icon:'trash',
            role: 'destructive',
            handler: () => {
              this.listService.deleteUserList(this.currentUser.uid, list.$key).then(()=> {
                  this.toastCtrl.create({
                      message: data.SALISTE,
                      duration: 3000
                  }).present()
              })
            }
          },
          {
            text: data.CANCELAR,
            icon: 'close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      }).present();
    });
  }

  public openList(list: any) {
    this.navCtrl.push(ListaPage, {currentList: list});
  }

}
