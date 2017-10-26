import { Component } from '@angular/core';
import { LoadingController, ViewController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TranslateService } from "@ngx-translate/core";
import { NetworkService } from "../../providers/network-service";


@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html'
})
export class AddItemPage {
    public currentUser: User;
    public listId: string;
    public addItemForm: FormGroup;
    private loader: any;

    private index: number;

    constructor(private loadingCtrl: LoadingController,
    public navParams: NavParams,
    private speechRecognition: SpeechRecognition,
    private translation: TranslateService,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public networkService: NetworkService,
    public listService: ListService) {
        this.translation.get(["CARGANDO"]).subscribe((data) => {
            this.loader = this.loadingCtrl.create(
                {
                content: data.CARGANDO
                }
            );
        })
        this.listId = this.navParams.get('listId');
        this.addItemForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
        this.index = this.navParams.get("index");
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

    public saveItem(newItem: any) {
        if (newItem.name.trim()) {
            this.loader.present();

            this.listService.addItem(this.listId, newItem)
            .then (data => {
                this.loader.dismiss();
                this.viewCtrl.dismiss();
            })
            .catch(error => {
                this.loader.dismiss();
                this.viewCtrl.dismiss();
                this.networkService.showErrorMessage();
            })
        }
    }

    public speech (newItem: any) {
        let lang;
        if (this.translation.currentLang == "en") {
            lang = "en-US";
        } else {
            lang = "es-ES";
        }
        let options = {
            language: lang
        }
        // Start the recognition process
        this.speechRecognition.hasPermission().then((hasPermision) => {
            if (hasPermision) {
                this.speechRecognition.startListening(options)
                .subscribe(
                    (matches: Array<string>) => {
                        newItem.name = matches[0];
                    },
                    (onerror) => console.log('error:', onerror)
                )
            } else {
                this.speechRecognition.requestPermission().then(() => {
                    this.speechRecognition.startListening(options)
                    .subscribe(
                        (matches: Array<string>) => {
                            newItem.name = matches[0];
                        },
                        (onerror) => console.log('error:', onerror)
                    )
                }).catch((err) => { console.log(err) });
            }
        }).catch(e => console.log(e));
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}