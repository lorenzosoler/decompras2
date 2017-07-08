import { Component } from '@angular/core';
import { LoadingController, ViewController } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";


@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html'
})
export class AddListPage {
    public currentUser: User;
    public addListForm: FormGroup;
    public nowData: Date;

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public listService: ListService) {
        this.nowData = new Date();
        this.addListForm = this.formBuilder.group({
            name: ['', Validators.required],
            detail: [''],
            date: [''],
            hour: ['']
        });
    }

    ionViewWillEnter() {
        this.currentUser = this.userService.getCurrentUser();
    }

    public saveList(newList: any) {
        if (newList.name.trim()) {
            let loader = this.loadingCtrl.create({
                content: 'Creando...'
            });
            loader.present();

            let list = this.listService.saveList(newList);
            loader.dismiss();
            this.viewCtrl.dismiss(list);
        }
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}