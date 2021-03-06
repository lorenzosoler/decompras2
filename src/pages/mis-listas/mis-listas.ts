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
import { StatusBar } from "@ionic-native/status-bar";

@Component({
  selector: 'page-mis-listas',
  templateUrl: 'mis-listas.html'
})
export class MisListasPage {
  @ViewChild(Content) content: Content;
  private currentUser: User;
  private myLists: any[] = [];
  public showLoader: boolean = false;
  private listNotif: any;

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private globalization: Globalization,
    private socialSharing: SocialSharing,
    public navParams: NavParams,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private localNotifications: LocalNotifications,
    private calendar: Calendar,
    private oneSignal: OneSignal,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public listService: ListService,
    private statusBar: StatusBar, 
    public userService: UserService) {
      this.listNotif = this.navParams.get("listNotif");
      this.currentUser = this.userService.getCurrentUser();
  }

  ionViewDidLoad() {
    this.showLoader = true;
    this.listService.getLists().subscribe(lists => {
       this.myLists = lists;
       if (this.listNotif) {
         this.openList(this.listNotif, this.myLists.length - 1);
       }
       this.showLoader = false;
    });
  }

  ionViewWillEnter () {
    this.statusBar.backgroundColorByName("darkGray");
  }

	public invitPerson () {
	  this.translate.get(["INVITACION"]).subscribe((data) => {
		  this.socialSharing.share(data.INVITACION,'',[], 'https://play.google.com/store/apps/details?id=ar.com.indigodesign.decompras');
	  })
	}

  public addList() {
    let that = this;
    let i = this.myLists.length;
    let addListModal = this.modalCtrl.create(AddListPage, {index: i}, { enableBackdropDismiss: false });

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
          this.openList(list, this.myLists.length - 1);
        }
      })
    });

    addListModal.present();
  }

  public openList(list: any, index: number) {
    this.navCtrl.push(ListaPage, {currentList: list, index: index});
  }

}
