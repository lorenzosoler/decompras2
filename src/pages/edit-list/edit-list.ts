import { Component } from '@angular/core';
import { LoadingController, ViewController, NavController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";


@Component({
  selector: 'page-edit-list',
  templateUrl: 'edit-list.html'
})
export class EditListPage {
    public currentUser: User;
    public currentList: any;
    public editListForm: FormGroup;
    public nowData: Date;

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public listService: ListService) {
        this.currentList = this.navParams.get('currentList');
        this.nowData = new Date();
        this.editListForm = this.formBuilder.group({
            name: [this.currentList.name, Validators.required],
            detail: [this.currentList.detail],
            date: [this.currentList.date],
            hour: [this.currentList.hour]
        });
    }

    ionViewWillEnter() {
        this.currentUser = this.userService.getCurrentUser();
    }

    public editList(newList: any) {
        if (newList.name.trim()) {
            let loader = this.loadingCtrl.create();
            loader.present();

            this.listService.editList(this.currentList.$key, newList);
            loader.dismiss();
            this.viewCtrl.dismiss(this.currentList, newList);
        }
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }
}