import { Component } from '@angular/core';
import { LoadingController, ViewController, NavController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../../providers/network-service";
import { DatePicker } from "@ionic-native/date-picker";


@Component({
  selector: 'page-edit-list',
  templateUrl: 'edit-list.html'
})
export class EditListPage {
    public currentUser: User;
    public currentList: any;
    public editListForm: FormGroup;
    public nowData: Date;
    private loader: any;
    private index: number;

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public translate: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private datePicker: DatePicker,
    public userService: UserService,
    public networkService: NetworkService,
    public listService: ListService) {
        this.currentList = this.navParams.get('currentList');
        this.index = this.navParams.get('index');
        this.nowData = new Date();
        this.translate.get(["CARGANDO"]).subscribe((data) => {
            this.loader = this.loadingCtrl.create(
                {
                content: data.CARGANDO
                }
            );
        })
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

    public isViolet (): boolean {
        return (this.index % 3 == 0 || this.index % 3 == 3); 
    }

    public isRed(): boolean {
        return (this.index % 3 == 1);
    }

    public isGreen(): boolean {
        return (this.index % 3 == 2);
    }

    public showDate() {
        var fec:String = this.editListForm.get("date").value.split('/');
        if (fec == "") {
            this.datePicker.show({
                date: new Date(),
                mode: 'date',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                }).then(
                (date:Date) => {
                    this.editListForm.reset({
                        "name": this.editListForm.get("name").value,
                        "detail": this.editListForm.get("detail").value,
                        "date": date.toLocaleDateString(),
                        "hour": this.editListForm.get("hour").value
                    })
                },
                err => console.log('Error occurred while getting date: ', err)
            );
        } else {
            let year = Number(fec[2]);
            let day = Number(fec[0]);
            let month = Number(fec[1]) - 1;
            this.datePicker.show({
                date: new Date(year, month, day),
                mode: 'date',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                }).then(
                (date:Date) => {
                    this.editListForm.reset({
                        "name": this.editListForm.get("name").value,
                        "detail": this.editListForm.get("detail").value,
                        "date": date.toLocaleDateString(),
                        "hour": this.editListForm.get("hour").value
                    })
                },
                err => console.log('Error occurred while getting date: ', err)
            );
        }
    }

    public showHour() {
        var hour:String = this.editListForm.get("hour").value.split(':');
        if (hour == "") {
            this.datePicker.show({
                date: new Date(),
                mode: 'time',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                }).then(
                (time:Date) => {
                    this.editListForm.reset({
                        "name": this.editListForm.get("name").value,
                        "detail": this.editListForm.get("detail").value,
                        "date": this.editListForm.get("date").value,
                        "hour": time.toLocaleTimeString()
                    });
                },
                err => console.log('Error occurred while getting date: ', err)
            );
        } else {
            let hs = Number(hour[0]);
            let minutes = Number(hour[1]);
            this.datePicker.show({
                date: new Date(0, 0, 0, hs, minutes, 0),
                mode: 'time',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
                }).then(
                (time:Date) => {
                    this.editListForm.reset({
                        "name": this.editListForm.get("name").value,
                        "detail": this.editListForm.get("detail").value,
                        "date": this.editListForm.get("date").value,
                        "hour": time.toLocaleTimeString()
                    });
                },
                err => console.log('Error occurred while getting date: ', err)
            );
        }
    }

    public editList(newList: any) {
        if (newList.name.trim()) {
            this.loader.present();

            this.listService.editList(this.currentList.$key, newList)
            .then((data) => {
                this.loader.dismiss();
                this.viewCtrl.dismiss(this.currentList, newList);
            })
            .catch((e:Error) => {
                this.networkService.showErrorMessage();
                this.loader.dismiss();
                this.viewCtrl.dismiss();
            });
            
        }
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }
}