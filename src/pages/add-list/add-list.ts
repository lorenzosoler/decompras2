import { Component, ViewChild } from '@angular/core';
import { LoadingController, ViewController } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../../providers/network-service";
import firebase from 'firebase';


@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html'
})
export class AddListPage {
    public currentUser: User;
    public addListForm: FormGroup;
    public nowData: String;
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
        this.nowData = new Date().toISOString().replace('/','-');
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

    public showDate () {
        let date = document.getElementById("date");
        date.focus();
        date.click();
    }

    public showHour () {
        let hour = document.getElementById("hour");
        hour.focus();
        hour.click();
    }

    public saveList(newList: any) {
        if (newList.name.trim()) {
            this.loader.present();

            var currentUser = this.userService.getCurrentUser();
            newList.userCreator = currentUser.uid;
            newList.created = firebase.database.ServerValue.TIMESTAMP;
            newList.users = {};
            newList.users[currentUser.uid] = true;

            let listId = firebase.database().ref('lists').push(newList).key;
            
            this.listService.saveList(newList, listId)
            .then(data => {
                this.loader.dismiss();
                newList['$key'] = listId;
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