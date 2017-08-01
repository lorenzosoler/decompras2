import { ViewChild, Component } from "@angular/core";
import { Content, NavController, NavParams, LoadingController, ModalController, ActionSheetController, ToastController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { AddUserPage } from "../add-user/add-user";
import { TranslateService } from "@ngx-translate/core";

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

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public loadingCtrl: LoadingController,
  public actionSheetCtrl: ActionSheetController,
  private translate: TranslateService,
  public toastCtrl: ToastController,
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

  public addUser() {
    this.navCtrl.push(AddUserPage, {currentList: this.currentList});
  }

  public presentActionSheet(event, user: any) {
    event.stopPropagation();
    this.translate.get(["ELIMINAR", "CANCELAR", "HACERADMIN", "USUARIOELIMINADO"]).subscribe((data) => {
      let actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: [
          {
            text: data.HACERADMIN,
            icon: 'contact',
            handler: () => { }
          },
          {
            text: data.ELIMINAR,
            icon:'trash',
            role: 'destructive',
            handler: () => {
              this.listService.deleteUserList(user.$key, this.currentList.$key).then(()=>{
                this.toastCtrl.create({
                    message: data.USUARIOELIMINADO,
                    duration: 3000
                }).present()
              });
            }
          },
          {
            text: data.CANCELAR,
            icon: 'close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      actionSheet.present();
    })
  }
}