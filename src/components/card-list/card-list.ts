import { Component, Input } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavController, ModalController, AlertController, ToastController } from "ionic-angular";
import { EditListPage } from "../../pages/edit-list/edit-list";
import { Calendar } from "@ionic-native/calendar";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { ListaPage } from "../../pages/lista/lista";

@Component({
  selector: 'card-list',
  templateUrl: 'card-list.html'
})
export class CardListComponent {

  @Input() list: any;
  @Input() index: number;

  constructor(
    private translate: TranslateService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private calendar: Calendar,
    public toastCtrl: ToastController,
    public listService: ListService,
    public userService: UserService) {
  }

  public isViolet (): boolean {
     return (this.index % 3 == 0 || this.index % 3 == 3); 
  }

  public isRed(): boolean {
    return (this.index % 3 == 1);
  }

  public isGreen(): boolean {
    return (this.index % 3 == 2);
  }

  private deleteList (listId: string) {
    this.userService.getUsersByListId(listId).subscribe((users) => {
      this.listService.deleteList(listId, users).then(() => {
        this.translate.get(["LISTAELIMINADA"]).subscribe((data) => {
          this.toastCtrl.create({
              message: data.LISTAELIMINADA,
              duration: 3000
          }).present()
        })
      })
    });
  }

  private showConfirmDelete(listId: string) {
    this.translate.get([ "SEGUROELIMINAR", "CANCELAR", "ELIMINAR"]).subscribe((data) => {
      let confirm = this.alertCtrl.create({
        message: data.SEGUROELIMINAR,
        buttons: [
          {
            text: data.CANCELAR,
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: data.ELIMINAR,
            handler: () => {
              this.deleteList(listId);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  public editList (list: any) {
    let editListModal = this.modalCtrl.create(EditListPage, {currentList: list}, { enableBackdropDismiss: false });

    editListModal.present();

    editListModal.onDidDismiss((oldList, newList) => {
      if (oldList && newList) {
        let newDate;
        if(oldList.date != "") {
          let oldDate = new Date(oldList.date + ' ' + oldList.hour);
          newDate = new Date(newList.date + ' ' + newList.hour); 
          this.calendar.deleteEvent(oldList.name, '', oldList.detail, oldDate, oldDate).then((isDeleted) => {
            if (isDeleted) {
              this.calendar.createEventInteractivelyWithOptions(newList.name, '', newList.detail, newDate, newDate).then((msg) => {
                this.toastCtrl.create({
                    message: "Se edito el evento en el calendario para esta lista" + ': ' + msg,
                    duration: 3000
                }).present();
              })
            }
          }).catch(() => { console.log("no habia evento creado para esta lista")})
        } else {
          newDate = new Date(newList.date + ' ' + newList.hour); 
          this.calendar.createEventInteractivelyWithOptions(newList.name, '', newList.detail, newDate, newDate).then((msg) => {
            this.toastCtrl.create({
                message: "Se edito el evento en el calendario para esta lista" + ': ' + msg,
                duration: 3000
            }).present();
          })
        }
      }
    });

  }

  public openList(list: any) {
    this.navCtrl.push(ListaPage, {currentList: list, index: this.index});
  }

  public isAdmin(): Boolean {
    return this.listService.isAdmin(this.list, this.userService.getCurrentUser().uid);
  }

}