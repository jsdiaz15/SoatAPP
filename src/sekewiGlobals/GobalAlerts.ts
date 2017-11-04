import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';


@Injectable()
export class GlobalAlerts {
    public static alertCtrl: any;
    constructor(alertCtrl: AlertController) { }
    public static presentAlert(title: string, body: string, btntext: string) {
        const alert = GlobalAlerts.alertCtrl.create({
            title: 'Low battery',
            subTitle: '10% of battery remaining',
            buttons: [
                {
                    text: 'dissmiss',
                    handler: () => {
                        return true;
                    }
                }
            ]
        });
        alert.present();
    }



    public static presentConfirm() {
        const alert = GlobalAlerts.alertCtrl.create({
            title: 'Confirm purchase',
            message: 'Do you want to buy this book?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Buy',
                    handler: () => {
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    }




}