import { Component } from '@angular/core';
import { LoadingController, ViewController } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../../providers/network-service";


@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html'
})
export class AddListPage {
    public currentUser: User;
    public addListForm: FormGroup;
    public nowData: Date;
    private loader: any;

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public userService: UserService,
    public networkService: NetworkService,
    public listService: ListService) {
        this.translate.get(["CARGANDO"]).subscribe((data) => {
            this.loader = this.loadingCtrl.create(
                {
                content: data.CARGANDO
                }
            );
        })
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
            this.loader.present();

            var currentUser = this.userService.getCurrentUser();
            newList.userCreator = currentUser.uid;
            newList.created = firebase.database.ServerValue.TIMESTAMP;
            newList.users = {};
            newList.users[currentUser.uid] = true;

            this.listService.saveList(newList)
            .then(data => {
                this.loader.dismiss();
                this.viewCtrl.dismiss(newList);
            })
            .catch(error => {
                this.loader.dismiss();
                this.viewCtrl.dismiss();
                this.networkService.showErrorMessage();
            });
        }
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}