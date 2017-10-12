import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ToastController, AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

declare var Connection: any;

@Injectable()
export class NetworkService {

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private network: Network) {
  }

  /**
  */
  public watchConnectivity() {
    this.network.onDisconnect().subscribe(() => {
      this.showNoConnectionMessage();
    });
  }

  /**
  */
  public showNoConnectionMessage() {
    let toast = this.toastCtrl.create({
      message: 'Ups! No tenés conexión a internet',
      position: 'bottom',
      duration: 3000,
      showCloseButton: false,
      closeButtonText: 'OK'
    });

    toast.present();
  }

  public showErrorMessage() {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: 'Error. No tenes conexion a internet.',
      buttons: ['OK']
    });
    alert.present();
  }
}
