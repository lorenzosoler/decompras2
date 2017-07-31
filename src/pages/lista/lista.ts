
import { NavController, NavParams, ModalController, AlertController, ToastController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { Component } from "@angular/core";
import { AddItemPage } from "../add-item/add-item";
import { FormControl } from '@angular/forms';
import { UsersListPage } from "../users-list/users-list";
import { TranslateService } from "@ngx-translate/core";

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
  private translate: TranslateService,
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
    this.translate.get(["ELIMINARITEM", "ITEMELIMINADO", "ELIMINAR", "CANCELAR"]).subscribe((data) => {
      let prompt = this.alertCtrl.create({
        title: '',
        message: data.ELIMINARITEM,
        buttons: [
          {
            text: data.CANCELAR,
            handler: () => {
            }
          },
          {
            text: data.ELIMINAR,
            handler: () => {
              this.listService.deleteItem(this.currentList.$key, itemId).then(()=>{
                this.toastCtrl.create({
                  message: data.ITEMELIMINADO,
                  duration: 3000
                }).present()
              });
            }
          }
        ]
      });
      prompt.present();
    })
  }

  public updatePrice(item) {
    if (item.done) {
      this.translate.get(["PRECIOITEM", "PRECIO", "CANCELAR"]).subscribe((data) => {
        let prompt = this.alertCtrl.create({
          title: '',
          message: data.PRECIOITEM,
          inputs: [
            {
              name: 'price',
              placeholder: data.PRECIO,
              type: 'number'
            },
          ],
          buttons: [
            {
              text: data.CANCELAR,
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
      });
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
    this.translate.get(["TOTAL"]).subscribe((data) => {
      let prompt = this.alertCtrl.create({
        title: '$ ' + total,
        message: data.TOTAL,
        buttons: ['OK']
      });
      prompt.present();
    })
  }

}
