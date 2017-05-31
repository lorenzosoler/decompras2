
import { NavController, NavParams, ModalController, AlertController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { Component } from "@angular/core";
import { AddItemPage } from "../add-item/add-item";
import { FormControl } from '@angular/forms';
import { UsersListPage } from "../users-list/users-list";

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html'
})
export class ListaPage {
  public items: any[];
  public currentList: any;
  private originalItems: any;

  searchTerm: string = '';
  searchControl: FormControl;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public modalCtrl: ModalController,
  public alertCtrl: AlertController,
  public listService: ListService,
  public userService: UserService) {
      this.currentList = this.navParams.get('currentList');
      this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.listService.getItems(this.currentList.$key).subscribe(items => {
        this.items = items;
        this.originalItems = items;
    })
  }

  public addItem() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddItemPage, {listId: this.currentList.$key}, { enableBackdropDismiss: false });

    addListModal.present();
  }

  public updatePrice(item) {
    if (item.done) {
        let prompt = this.alertCtrl.create({
        title: 'Precio',
        message: "Ingrese el precio de este item",
        inputs: [
          {
            name: 'price',
            placeholder: 'Precio',
            type: 'number'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              item.done = false;
            }
          },
          {
            text: 'Ok',
            handler: data => {
              if( data.price > 0) {
                this.listService.setPrice(this.currentList.$key, item, Number(data.price) );
              }
            }
          }
        ]
      });
      prompt.present();
    } else {
      this.listService.setPrice(this.currentList.$key, item, 0);
    }
  }

  public getItems (ev: any) {
      this.items = this.originalItems;
      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.items = this.items.filter((item) => {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }

  public showUsers() {
    this.navCtrl.push(UsersListPage, {'currentList': this.currentList});
  }

}
