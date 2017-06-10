import { ViewChild, Component } from "@angular/core";
import { Content, NavController, NavParams, LoadingController, ModalController } from "ionic-angular";
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
  public users: any[] = [];
  public showLoader: boolean = false;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public loadingCtrl: LoadingController,
  public listService: ListService,
  public userService: UserService) {
    this.currentList = this.navParams.get('currentList');
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
}