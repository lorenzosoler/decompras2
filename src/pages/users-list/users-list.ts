import { ViewChild, Component } from "@angular/core";
import { Content, NavController, NavParams, LoadingController, ModalController, ActionSheetController, ToastController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { AddUserPage } from "../add-user/add-user";

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
    let addListModal = this.navCtrl.push(AddUserPage, {currentList: this.currentList});
  }

  public presentActionSheet(event, user: any) {
    event.stopPropagation();

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Estás por eliminar este usuario de la lista. ¿Estás seguro?',
      buttons: [
        {
          text: 'Si, Eliminalo',
          icon:'trash',
          role: 'destructive',
          handler: () => {
            this.listService.deleteUserList(user.$key, this.currentList.$key).then(()=>{
              this.toastCtrl.create({
                  message: 'Usuario eliminado correctamente de la lista',
                  duration: 3000
              }).present()
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
}