
import { NavController, NavParams, ModalController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { Component } from "@angular/core";
import { AddItemPage } from "../add-item/add-item";

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html'
})
export class ListaPage {
  public items: any[];
  public currentList: any;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public modalCtrl: ModalController,
  public listService: ListService,
  public userService: UserService) {
      this.currentList = this.navParams.get('currentList');
  }

  ionViewDidLoad() {
    this.listService.getItems(this.currentList.$key).subscribe(items => {
        this.items = items;
    })
  }

  public addItem() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddItemPage, {listId: this.currentList.$key}, { enableBackdropDismiss: false });

    addListModal.present();
  }
}
