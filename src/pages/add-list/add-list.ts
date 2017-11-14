import { Component, ViewChild } from '@angular/core';
import { LoadingController, ViewController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../../providers/network-service";
import firebase from 'firebase';
import { DatePicker } from "@ionic-native/date-picker";


@Component({
  selector: 'page-add-list',
  templateUrl: 'add-list.html'
})
export class AddListPage {
    public currentUser: User;
    public addListForm: FormGroup;
    public nowData: String;
    private loader: any;

    private index: number;

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public params: NavParams,
    private datePicker: DatePicker,
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
        this.index = params.get('index');
    }

    public showDate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }).then(
            (date:Date) => {
                this.addListForm.reset({
                    "name": this.addListForm.get("name").value,
                    "detail": this.addListForm.get("detail").value,
                    "date": date.toLocaleDateString(),
                    "hour": this.addListForm.get("hour").value
                })
            },
            err => console.log('Error occurred while getting date: ', err)
        );
    }

    public showHour() {
        this.datePicker.show({
            date: new Date(),
            mode: 'time',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }).then(
            (time:Date) => {
                this.addListForm.reset({
                    "name": this.addListForm.get("name").value,
                    "detail": this.addListForm.get("detail").value,
                    "date": this.addListForm.get("date").value,
                    "hour": time.toLocaleTimeString()
                });
            },
            err => console.log('Error occurred while getting date: ', err)
        );
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
            newList.disc = 0;

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