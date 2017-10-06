

import { Component, ViewChild } from "@angular/core";
import { ListService } from "../../providers/list-service";
import { UserService } from "../../providers/user-service";
import { AlertController, NavParams, ToastController, Searchbar } from "ionic-angular";
import { NotificationsService } from "../../providers/notifications-service";
import { TranslateService } from "@ngx-translate/core";
import { SocialSharing } from "@ionic-native/social-sharing";
import { NetworkService } from "../../providers/network-service";

@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html'
})
export class AddUserPage {
	@ViewChild('searchbar') searchBar: Searchbar;

	public allUsers: any[] = [];
	public showLoader: boolean = false;
	public offset: number = 10;
	public currentList: any;

	constructor(public userService: UserService,
				public alertCtrl: AlertController,
				public navParams: NavParams,
				public toastCtrl: ToastController,
				private socialSharing: SocialSharing,
				private translate: TranslateService,
				public listService: ListService,
				public networkService: NetworkService,
				public notificationsService: NotificationsService) {
			this.currentList = this.navParams.get('currentList');
	}

	ionViewDidEnter() {
		setTimeout(() => {
		  this.searchBar.setFocus();
		}, 150);
	}

	public searchUsers(ev: any) {
		let val: string = ev.target.value;
		if (val.trim() === '') {
			this.allUsers = [];
			return;
		}
		this.showLoader = true;
		this.userService.searchUsers(val).subscribe((users) => {
			this.allUsers = users;
			this.showLoader = false;
		})
	}

	public addUser (user) {
		this.translate.get(["ADDUSER", "SERAMIEMBRO", "CANCELAR" ]).subscribe((data) => {
			let confirm = this.alertCtrl.create({
				title: '',
				message: '<strong>' + user.fullname + '</strong>' + ' ' + data.SERAMIEMBRO + '<strong>' + this.currentList.name +'</strong>',
				buttons: [
				{
					text: data.CANCELAR,
					handler: () => {
					}
				},
				{
					text: 'Ok',
					handler: () => {
						this.confirmAddUser(user);
					}
				}
				]
			});
			confirm.present();
		})
	}

	private confirmAddUser(user: any) {
		this.translate.get(["REPETIRUSER", "ADDUSERCORRECT" ]).subscribe((data) => {
			for(let key in this.currentList.users) {
				if (key === user.$key) {
					let alert = this.alertCtrl.create({
						message: data.REPETIRUSER,
						buttons: ['OK']
					});
					alert.present();
					return;
				}
			};
			this.listService.addUser(this.currentList.$key, user.$key).then((data1) =>{
				this.notificationsService.addUserList(this.currentList, user);
				this.toastCtrl.create({
					message: data.ADDUSERCORRECT,
					duration: 3000
				}).present();
			}).catch(error => {
				this.networkService.showErrorMessage();
			});
		});
	}

	public invitPerson () {
	  this.translate.get(["INVITACION"]).subscribe((data) => {
		this.socialSharing.share(data.INVITACION,'',[], 'https://play.google.com/store/apps/details?id=ar.com.indigodesign.decompras');
	  })
	}

}