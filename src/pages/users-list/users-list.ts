import { ViewChild, Component } from "@angular/core";
import { Content, NavController, NavParams } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";

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
  public listService: ListService,
  public userService: UserService) {
    this.currentList = this.navParams.get('currentList');
  }

  ionViewDidLoad() {
    this.listService.getUsers(this.currentList.$key).subscribe(users=> {
        this.users = users;
    });
  }
}