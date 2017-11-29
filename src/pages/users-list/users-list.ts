import { ViewChild, Component } from "@angular/core";
import { Content, NavController, NavParams, ModalController, ActionSheetController, ToastController, AlertController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { AddUserPage } from "../add-user/add-user";
import { TranslateService } from "@ngx-translate/core";
import { MisListasPage } from "../mis-listas/mis-listas";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'page-users-list',
  templateUrl: 'users-list.html'
})
export class UsersListPage {
  @ViewChild(Content) content: Content;
  public currentList: any;
  public currentUser: any;
  public users: any[] = [];
  public showLoader: boolean = false;

  private subscribeIsMember: Subscription;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public actionSheetCtrl: ActionSheetController,
  private translate: TranslateService,
  public toastCtrl: ToastController,
  public alertCtrl: AlertController,
  public listService: ListService,
  public userService: UserService) {
    this.currentList = this.navParams.get('currentList');
    this.currentUser = this.userService.getCurrentUser();
  }

  ionViewDidLoad() {
    this.showLoader = true;
    this.listService.getUsers(this.currentList.$key).subscribe(users=> {
        this.users = users;
        this.showLoader = false;
    });
  }

  ionViewWillEnter () {
    this.subscribeIsMember = this.listService.isMember(this.currentList.$key, this.userService.getCurrentUser().uid).subscribe((user) => {
      if (!user.$value) {
        this.alertCtrl.create({
          title: '',
          message: 'Has sido eliminado de esta lista: ' + this.currentList.name,
          buttons: [{
            text: 'ACEPTAR',
            handler: data => {
              this.navCtrl.setRoot(MisListasPage);
            }
          }]
        }).present();
      }
    });
  }

  ionViewDidLeave() {
    this.subscribeIsMember.unsubscribe();
  }

  public addUser() {
    this.navCtrl.push(AddUserPage, {currentList: this.currentList});
  }

  public isAdmin(): Boolean {
    return this.listService.isAdmin(this.currentList, this.currentUser.uid);
  }

  public isUserAdmin(userId: string): Boolean {
    return this.listService.isAdmin(this.currentList, userId);
  }

  private setUserAdmin (userId: string, msg: string) {
    this.listService.setUserAdmin(this.currentList.$key, userId).then((data) => {
      if (this.currentList.admins == undefined) {
        this.currentList.admins = {};
      }
      this.currentList.admins[userId] = true;
      this.toastCtrl.create({
          message: msg,
          duration: 3000
      }).present()
    }).catch(e => console.log(e))
  }

  private deleteUserAdmin (userId: string, msg: string) {
    this.listService.deleteUserAdmin(this.currentList.$key, userId).then((data) => {
      delete this.currentList.admins[userId];
      this.toastCtrl.create({
          message: msg,
          duration: 3000
      }).present()
    }).catch(e => console.log(e));
  }

  public presentActionSheet(event, user: any) {
    event.stopPropagation();
    this.translate.get(["ELIMINAR", "CANCELAR", "HACERADMIN", "NOTADMIN", "DEJOADMIN", "USUARIOELIMINADO", "USUARIOADMIN"]).subscribe((data) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: this.isUserAdmin(user.uid) ? data.NOTADMIN : data.HACERADMIN,
            icon: 'contact',
            cssClass: 'admin-action-sheet',
            handler: () => {
              if (!this.isUserAdmin(user.uid)) {
                this.setUserAdmin(user.$key, data.USUARIOADMIN);
              } else {
                this.deleteUserAdmin(user.$key, data.DEJOADMIN);
              }
            }
          },
          {
            text: data.ELIMINAR,
            icon:'eliminar-item',
            cssClass: 'eliminar-action-sheet',
            role: 'destructive',
            handler: () => {
              delete this.currentList.users[user.$key];
              this.listService.deleteUserList(user.$key, this.currentList.$key).then(()=>{
                this.toastCtrl.create({
                    message: data.USUARIOELIMINADO,
                    duration: 3000
                }).present()
              }).catch(e => console.log(e));
            }
          },
          {
            text: data.CANCELAR,
            icon: 'close',
            cssClass: 'cancelar-action-sheet',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      actionSheet.present();
    })
  }
}