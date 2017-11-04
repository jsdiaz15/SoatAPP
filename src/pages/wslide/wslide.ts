import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

/**
 * Generated class for the WslidePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-wslide',
  templateUrl: 'wslide.html',
})
export class WslidePage {

  slides = [
    {
      title: this.translate.instant('wslide.slide_title_s1'),
      description: this.translate.instant('wslide.slide_txt_s1'),
      image: "img/slide1.svg",
    },
    {
      title: this.translate.instant('wslide.slide_title_s2'),
      description: this.translate.instant('wslide.slide_txt_s2'),
      image: "img/slide2.svg",
    },
    {
      title: this.translate.instant('wslide.slide_title_s3'),
      description: this.translate.instant('wslide.slide_txt_s3'),
      image: "img/slide3.svg",
    },
    {
      title: this.translate.instant('wslide.slide_title_s4'),
      description: this.translate.instant('wslide.slide_txt_s4'),
      image: "img/slide4.svg",
    }
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WslidePage');
  }
  popPage() {
    this.navCtrl.pop();
  }

}
