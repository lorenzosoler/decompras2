import { Component } from '@angular/core';
import { LoadingController, ViewController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";


@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html'
})
export class AddItemPage {
    public currentUser: User;
    public listId: string;
    public addItemForm: FormGroup;

    constructor(private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public listService: ListService) {
        this.listId = this.navParams.get('listId');
        this.addItemForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }

    ionViewWillEnter() {
        this.currentUser = this.userService.getCurrentUser();
    }

    public saveItem(newItem: any) {    
        let loader = this.loadingCtrl.create({
            content: 'Creando...'
        });
        loader.present();

        this.listService.addItem(this.listId, newItem).then(data => {
            loader.dismiss();
            this.viewCtrl.dismiss();
        })
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}