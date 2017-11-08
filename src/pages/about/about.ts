import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  public versionApp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appVersion: AppVersion) {
  }

  ionViewDidLoad() {
    this.appVersion.getVersionNumber().then((v) => {
      this.versionApp = v;
    });
  }

}
