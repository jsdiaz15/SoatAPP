import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/*
  Generated class for the Tax page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tax',
  templateUrl: 'tax.html'
})
export class TaxPage {

  constructor(public navTaxCtrl: NavController, public navParams: NavParams, public platform: Platform,
    private iab: InAppBrowser) {
    this.platform = platform;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaxPage');
    ////****Registry Backbutton Android / WindowsPhone
    this.platform.registerBackButtonAction(() => {
      this.backButtonClick();
    });
    let options = 'location=yes,toolbar=yes,hidden=no,hardwareback=yes';
    let url = 'http://vehiculos.valledelcauca.gov.co/post_smart_valle_prod/www/com.aspsolutions.GWTJSuite/GWTJSuite.html?cn=com.smart.src.taxvalle.taxinva.taxinva&war=post_smart_valle_prod';
    const browser = this.iab.create(url, '_blank', options);
  }


  backButtonClick() {
    this.navTaxCtrl.pop();
  }









}
