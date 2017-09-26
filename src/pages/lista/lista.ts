
import { NavController, NavParams, ModalController, AlertController, ToastController } from "ionic-angular";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { AddItemPage } from "../add-item/add-item";
import { OptionsListPage } from "../options-list/options-list";
import { FormControl } from '@angular/forms';
import { UsersListPage } from "../users-list/users-list";
import { TranslateService } from "@ngx-translate/core";
import { PopoverController } from 'ionic-angular';
import { AddUserPage } from "../add-user/add-user";
import { StatusBar } from "@ionic-native/status-bar";

@Component({
  selector: 'page-lista',
  templateUrl: 'lista.html'
})
export class ListaPage {
  public items: any[];
  public currentList: any;
  public total: number;
  public totalDisc: number;
  public disc: number = null;
  private originalItems: any;
  public showLoader: boolean = false;
  public order: string = '';

  searchTerm: string = '';
  searchControl: FormControl;

  constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public modalCtrl: ModalController,
  public alertCtrl: AlertController,
  public toastCtrl: ToastController,
  public listService: ListService,
  public popoverCtrl: PopoverController,
  private translate: TranslateService,
  private statusBar: StatusBar,
  public userService: UserService) {
      this.currentList = this.navParams.get('currentList');
      this.searchControl = new FormControl();
      this.statusBar.backgroundColorByHexString('24b9a2');
  }

  ionViewDidLoad() {
    this.showLoader = true;
    this.listService.getItems(this.currentList.$key).subscribe(items => {
        this.items = items;
        this.originalItems = items;
        this.recalcTotal();
        this.showLoader = false;
    })
  }

  presentOptions(myEvent) {
    let popover = this.popoverCtrl.create(OptionsListPage, {currentList: this.currentList, currentUser: this.userService.getCurrentUser()});

    popover.onDidDismiss( (action) => {
      if (action == "showUsers") {
        this.showUsers();
      } else if (action == "addUser") {
        this.addUser();
      } else if (action == "orderByPrice") {
        this.order = 'price';
      } else if (action == "descuento") {
        this.descuento()
      }
    })

    popover.present({
      ev: myEvent
    });
  }

  private descuento () {
    this.translate.get(["APLICARDESCUENTO", "DESCUENTO", "APLICAR", "CANCELAR"]).subscribe((data) => {
      let prompt = this.alertCtrl.create({
        title: '',
        message: data.APLICARDESCUENTO,
        inputs: [
          {
            name: 'descuento',
            placeholder: data.DESCUENTO,
            type: 'number'
          },
        ],
        buttons: [
          {
            text: data.CANCELAR,
            handler: data => {
            }
          },
          {
            text: data.APLICAR,
            handler: data => {
              this.disc = Number(data.descuento)
              this.recalcTotal();
            }
          }
        ]
      });
      prompt.present();
    });
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
                if( data.price >= 0) {
                  this.listService.setPrice(this.currentList.$key, item, Number(data.price) ).then(() => {
                    this.recalcTotal();
                  });
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

  public addUser() {
    this.navCtrl.push(AddUserPage, {currentList: this.currentList});
  }

  public recalcTotal() {
    let total = 0;
    this.items.forEach((item) => {
      total = total + item.price;
    })
    if (this.disc) {
      total = total - (total*(this.disc/100));
      this.totalDisc = total;
    } else {
      this.total = total;
    }
  }
}
