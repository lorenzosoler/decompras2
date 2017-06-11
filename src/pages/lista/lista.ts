
import { NavController, NavParams, ModalController, AlertController, ToastController } from "ionic-angular";
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
  public showLoader: boolean = false;

  searchTerm: string = '';
  searchControl: FormControl;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public modalCtrl: ModalController,
  public alertCtrl: AlertController,
  public toastCtrl: ToastController,
  public listService: ListService,
  public userService: UserService) {
      this.currentList = this.navParams.get('currentList');
      this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.showLoader = true;
    this.listService.getItems(this.currentList.$key).subscribe(items => {
        this.items = items;
        this.originalItems = items;
        this.showLoader = false;
    })
  }

  public addItem() {
    let that = this;
    let addListModal = this.modalCtrl.create(AddItemPage, {listId: this.currentList.$key}, { enableBackdropDismiss: false });

    addListModal.present();
  }

  public deleteItem(itemId:string) {
    let prompt = this.alertCtrl.create({
      title: 'Eliminar',
      message: "Seguro desea eliminar este item?",
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.listService.deleteItem(this.currentList.$key, itemId).then(()=>{
              this.toastCtrl.create({
                message: 'Item eliminado correctamente',
                duration: 3000
              }).present()
            });
          }
        }
      ]
    });
    prompt.present();
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

  public showTotal() {
    let total = 0;
    this.items.forEach((item) => {
      total = total + item.price;
    })
    let prompt = this.alertCtrl.create({
      title: '$' + total,
      message: 'Es el total de esta lista',
      buttons: ['OK']
    });
    prompt.present();
  }

}
