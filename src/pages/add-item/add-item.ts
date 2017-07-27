import { Component } from '@angular/core';
import { LoadingController, ViewController, NavParams } from "ionic-angular";

import { ListService } from "../../providers/list-service";
import { User } from "../../models/user";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UserService } from "../../providers/user-service";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Globalization } from "@ionic-native/globalization";


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
    private speechRecognition: SpeechRecognition,
    private globalization: Globalization,
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
        if (newItem.name.trim()) {
            let loader = this.loadingCtrl.create();
            loader.present();

            this.listService.addItem(this.listId, newItem).then(data => {
                loader.dismiss();
                this.viewCtrl.dismiss();
            })
        }
    }

    public speech (newItem: any) {
        this.globalization.getLocaleName().then((locale) => {
            let options = {
                language: locale.value
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
            })
        })
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}