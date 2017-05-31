
import { NavController, NavParams, ModalController, AlertController } from "ionic-angular";
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
  public alertCtrl: AlertController,
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
              console.log('Cancel clicked');
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
}
