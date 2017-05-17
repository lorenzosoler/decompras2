import { Component } from '@angular/core';
import { LoadingController, ViewController } from "ionic-angular";
import { Lista } from "../../models/lista";
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

    constructor(private loadingCtrl: LoadingController,
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public userService: UserService,
    public listService: ListService) {
        this.addListForm = this.formBuilder.group({
            name: ['', Validators.required],
            detail: ['', Validators.required]
        });
    }

    ionViewWillEnter() {
        this.currentUser = this.userService.getCurrentUser();
    }

    public saveList(newList: any) {    
        let loader = this.loadingCtrl.create({
            content: 'Creando...'
        });
        loader.present();

        let list = this.listService.saveList(newList);
        this.viewCtrl.dismiss(new Lista(list));
        loader.dismiss();
    }

    public dismiss() {
        this.viewCtrl.dismiss();
    }

}