

import { Component } from "@angular/core";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { AlertController, NavParams, ToastController } from "ionic-angular";

@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html'
})
export class AddUserPage {
    public allUsers: any[] = [];
    public showLoader: boolean = false;
    public offset: number = 10;
    public currentList: any;

    constructor(public userService: UserService,
                public alertCtrl: AlertController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public listService: ListService) {
            this.currentList = this.navParams.get('currentList');
    }

    ionViewDidLoad() {

    }

    public searchUsers(ev: any) {
        let val = ev.target.value;
        if (val.trim() === '') {
            this.allUsers = [];
            return;
        }
        this.showLoader = true;
        this.userService.searchUsers(val).subscribe((users) => {
            this.allUsers = users;
            this.showLoader = false;
        })
    }

    public addUser (user) {
        let confirm = this.alertCtrl.create({
        title: 'Agregar usuario',
        message: "El usuario " + user.fullname + ' será miembro de la lista: ' + this.currentList.name,
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
          {
            text: 'Ok',
            handler: () => {
                for(let key in this.currentList.users) {
                    if (key === user.$key) {
                        let alert = this.alertCtrl.create({
                            title: 'Atención!',
                            subTitle: 'El usuario seleccionado ya es miembro de esta lista',
                            buttons: ['OK']
                        });
                        alert.present();
                        return;
                    }
                };
                this.listService.addUser(this.currentList.$key, user.$key).then((data) =>{
                    this.toastCtrl.create({
                        message: 'Usuario agregado correctamente a la lista',
                        duration: 3000
                    }).present()
                });
            }
          }
        ]
      });
      confirm.present();
    }
}