import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RememberPage } from '../remember/remember';
import { SoatPage } from '../soat/soat';
import { TaxPage } from '../tax/tax';
import { WslidePage } from '../wslide/wslide';
import firebase from 'firebase';
/*
  Generated class for the Service page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-service',
    templateUrl: 'service.html'

})
export class ServicePage {
    private Uid: string;
    private Plate: string;
    private City: string;
    public vchId: string;


    constructor(public navServiceCtrl: NavController, public navParams: NavParams,
        public platform: Platform, private iab: InAppBrowser) {
        this.Uid = navParams.get('uid');
        this.Plate = navParams.get('plate');
        this.vchId = navParams.get('vchId');
        this.platform = platform;
        //      this.City = navParams.get('city');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ServicePage');
        ////****Registry Backbutton Android / WindowsPhone
        this.platform.registerBackButtonAction(() => {
            this.backButtonClick();
        });

        //getUser
        firebase.database().ref('users/' + this.Uid).once('value').then((snapshot) => {
            this.City = snapshot.val().city;
        });
    }

    goToNextPage(page: number) {
        switch (page) {
            case 1:
                this.navServiceCtrl.push(RememberPage, { plate: this.Plate, uid: this.Uid, city: this.City, vchId: this.vchId });
                break;
            case 2:
                this.navServiceCtrl.push(SoatPage, { plate: this.Plate, uid: this.Uid, city: this.City, vchId: this.vchId });
                break;
            case 3:
                break;
            case 4:
                let options = 'location=yes,toolbar=yes,hidden=no,hardwareback=yes';
                let url = 'http://vehiculos.valledelcauca.gov.co/post_smart_valle_prod/www/com.aspsolutions.GWTJSuite/GWTJSuite.html?cn=com.smart.src.taxvalle.taxinva.taxinva&war=post_smart_valle_prod';
                const browser = this.iab.create(url, '_blank', options);
                //this.navServiceCtrl.push(TaxPage, { plate: this.Plate, uid: this.Uid, city: this.City, vchId: this.vchId });
                break;
            case 5:
            this.navServiceCtrl.push(WslidePage);
                break;
        }
    }

    backButtonClick() {
        this.navServiceCtrl.pop();
    }
}