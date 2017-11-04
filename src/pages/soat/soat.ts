import { Component } from '@angular/core';
//import { Email } from 'emailjs';
//import * as emailjs from "emailjs";
import { SekewiGlobals } from '../../providers/sekewiglobals';
import { SoatGlobals } from '../../providers/soatglobals';
import { NavController, NavParams, Platform, LoadingController, ToastController, IonicApp } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'; //FormControl,
//import { EmailComposer } from 'ionic-native';
//import { Http, Request, RequestMethod, Headers} from "@angular/http";
import { Http, Headers, Request, RequestMethod } from "@angular/http"; //Response, RequestOptions,
import { PhoneValidator } from '../../validators/phone';
import { AdMob } from 'ionic-native'; //File,
import firebase from 'firebase';

/*
  Generated class for the Soat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-soat',
    templateUrl: 'soat.html',
    providers: [SekewiGlobals, SoatGlobals]
})
export class SoatPage {

    http: Http;
    mailgunUrl: string;
    mailgunApiKey: string;

    public getSoatform: FormGroup;
    private City: any;
    private Uid: string;
    private Plate: string;
    public sekewi: any;
    private soat: any;
    private vchId: any;
    private fileName: string;
    private fileRef: any;
    private SoatFront: any;
    private loading: any;
    public VehicleData = {
        brand: '',
        plate: '',
        ref: ''
    };

    constructor(public navSoatCtrl: NavController, public navParams: NavParams, public sekewiglobals: SekewiGlobals,
        public soatglobals: SoatGlobals, public translate: TranslateService, fb: FormBuilder,
        public platform: Platform, public loadingCtrl: LoadingController, http: Http,
        public toastCtrl: ToastController, private ionicApp: IonicApp) {
        this.platform = platform;
        this.Uid = navParams.get('uid');
        this.Plate = navParams.get('plate');
        this.City = navParams.get('city');
        this.vchId = navParams.get('vchId');
        this.getSekewiGlobals();
        this.getSoatGlobals();

        //Validations to form
        this.getSoatform = fb.group({
            "payment": ['', Validators.required],
            "phone": ['', Validators.compose([Validators.required, PhoneValidator.checkPhone])],
            "address": ['', Validators.required],
            "address2": ['', Validators.required],
        });

        this.http = http;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SoatPage');
        //Registry Backbutton Android / WindowsPhone
        this.platform.registerBackButtonAction(() => {
            this.backButtonClick();
        });
    }


    ionViewDidEnter() {
        ////****Set Admob Advertisement
        AdMob.prepareInterstitial({
            adId: 'ca-app-pub-2151147081552695/4926688367',
            autoShow: false
        });
        ////****Add event when user close banner
        document.addEventListener('onAdDismiss', (data) => {
            AdMob.removeBanner();
        });

        //Set api key
        this.mailgunApiKey = window.btoa(this.sekewi.Mail.mailgunApiKey);

        //Get Vehicle data
        firebase.database().ref(this.sekewi.Routes.users + this.Uid + '/vehicles/' + this.Plate.toLowerCase()).once('value').then((snapshot) => {
            this.VehicleData.brand = snapshot.val().branding;
            this.VehicleData.plate = snapshot.val().plate;
            this.VehicleData.ref = snapshot.val().reference;
            //        this.City = snapshot.val().city;
        });
    }


    onSubmit() {
        this.loading = this.loadingCtrl.create({
            content: this.translate.instant('soat.ldng_txt_send_request')
        });
        this.loading.present();

        this.fileName = this.VehicleData.plate.toLowerCase() + this.soat.ImgNames.soatFront + this.sekewi.ImgFormats.jpg;
        this.fileRef = firebase.storage().ref(this.sekewi.Routes.images + this.Uid + '/' + this.Plate + '/' + this.fileName);
        this.fileRef.getDownloadURL().then((url) => {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                this.SoatFront = xhr.response;
                this.sendMail();
            };
            xhr.onerror = (error) => {
                alert("BAD: " + error);
            };
            xhr.open('GET', url, true);
            xhr.send();

        }).catch((error) => {
            alert("Error getting image");
            // Handle any errors
        });

        /*console.log("model-based form submitted");
        console.log(this.getSoatform.value.payment);
        //Get Images from FireBase DB*/
    }


    backButtonClick() {

        let activePortal = this.ionicApp._loadingPortal.getActive() ||
            this.ionicApp._modalPortal.getActive() ||
            this.ionicApp._toastPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
            activePortal.dismiss();
        } else {
            this.navSoatCtrl.pop();
        }
    }

    getSekewiGlobals() {
        this.sekewiglobals.loadSekewiGlobals()
            .then((data) => {
                this.sekewi = data;
            });
    }

    getSoatGlobals() {
        this.soatglobals.loadSoatGlobals()
            .then((data) => {
                this.soat = data;
            });
    }

    sendMail() {
        var requestHeaders = new Headers();
        var bodyMail: FormData = new FormData();
        if (!this.platform.is('core')) {
            ////Mail Mobile    
            //requestHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            requestHeaders.append("Authorization", "Basic " + this.mailgunApiKey);
            requestHeaders.append("enctype", "multipart/form-data");
            requestHeaders.append('Accept', 'application/json');

            bodyMail.append('from', "soatapp@gmail.com");
            bodyMail.append('to', "soatapp@gmail.com");
            bodyMail.append('bcc', "jsdiaz0415@gmail.com");
            bodyMail.append('subject', "Solicitud de SOAT");
            bodyMail.append('text', "Datos del Vehículo \n \n" +
                "Vehiculo: " + this.VehicleData.brand + " " + this.VehicleData.ref + "\n" +
                "Placa: " + this.VehicleData.plate + "\n" +
                "Tipo de Pago: " + this.getSoatform.value.payment + "\n" +
                "Dirección: " + this.getSoatform.value.address + " " + this.getSoatform.value.address2 + "\n" +
                "Telefono: " + this.getSoatform.value.phone + "\n");
            //body.append('html', html);
            bodyMail.append('attachment', this.SoatFront, 'soat.jpg');

            this.http.request(new Request({
                method: RequestMethod.Post,
                url: "https://api.mailgun.net/v3/" + this.sekewi.Mail.mailgunUrl + "/messages",
                body: bodyMail,
                headers: requestHeaders
            })).subscribe(success => {
                this.loading.dismiss();
                AdMob.showInterstitial();
                this.navSoatCtrl.pop();
            }, error => {
                this.loading.dismiss();
                alert("ERROR -> " + JSON.stringify(error));
                console.log("ERROR -> " + JSON.stringify(error));
            });

        } else {
            //Mail WebBrowser
            requestHeaders.append("Authorization", "Basic " + this.mailgunApiKey);
            requestHeaders.append("enctype", "multipart/form-data");
            requestHeaders.append('Accept', 'application/json');

            bodyMail.append('from', "soatapp@gmail.com");
            bodyMail.append('to', "soatapp@gmail.com");
            bodyMail.append('bcc', "jsdiaz0415@gmail.com");
            bodyMail.append('subject', "Solicitud de SOAT");
            bodyMail.append('text', "HOLAK");
            //body.append('html', html);

            this.http.request(new Request({
                method: RequestMethod.Post,
                url: "https://api.mailgun.net/v3/" + this.sekewi.Mail.mailgunUrl + "/messages",
                body: bodyMail,
                headers: requestHeaders
            })).subscribe(success => {
                this.loading.dismiss();
                alert("SUCCESS -> " + JSON.stringify(success));
                console.log("SUCCESS -> " + JSON.stringify(success));
            }, error => {
                this.loading.dismiss();
                alert("ERROR -> " + JSON.stringify(error));
                console.log("ERROR -> " + JSON.stringify(error));
            });
        }

    }

}
