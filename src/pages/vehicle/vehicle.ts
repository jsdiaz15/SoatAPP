import { Component } from '@angular/core';
import { SekewiGlobals } from '../../providers/sekewiglobals';
import { SoatGlobals } from '../../providers/soatglobals';
import { NavController, AlertController, NavParams, Platform, LoadingController, IonicApp } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PlateValidator } from '../../validators/plate';
import { DashboardPage } from '../dashboard/dashboard';
//import { PlateValidatorMoto } from  '../../validators/platemoto';
import { Camera, AdMob } from 'ionic-native'; //File,
import { TranslateService } from 'ng2-translate/ng2-translate';
import firebase from 'firebase';

declare var window: any;
var listBase64Image: Array<any> = [];
//var listBase64Image: Array<any> = [,];
//var listBase64Image: Array<any>; 
//declare var AdMob: any

/*
  Generated class for the Vehicle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-vehicle',
    templateUrl: 'vehicle.html',
    providers: [SekewiGlobals, SoatGlobals]
})
export class VehiclePage {
    public uid: string;
    public vchID: number;
    public formVehicle: FormGroup;
    public sekewi: any;
    private soat: any;
    public brandings: any;
    public base64ImageBack: any;
    public base64ImageFront: any;
    private soatFace: any;
    public ImageCheck: boolean = false;
    private params: any;


    constructor(public navVehicleCtrl: NavController, fb: FormBuilder, public sekewiglobals: SekewiGlobals,
        public soatglobals: SoatGlobals, public alertCtrl: AlertController, public translate: TranslateService,
        private navParams: NavParams, public platform: Platform, public loadingCtrl: LoadingController,
        private ionicApp: IonicApp) {

        this.params = navParams;
        this.uid = navParams.get('uid');
        this.vchID = navParams.get('vehicleID');
        this.platform = platform;
        if (this.vchID == 1) {
            this.formVehicle = fb.group({
                "branding": ['', Validators.required],
                "reference": ['', Validators.required],
                "plate": ['', Validators.compose([Validators.required, PlateValidator.checkPlateMoto, Validators.maxLength(6), Validators.minLength(5)])]
            });
        } else {
            this.formVehicle = fb.group({
                "branding": ['', Validators.required],
                "reference": ['', Validators.required],
                "plate": ['', Validators.compose([Validators.required, PlateValidator.checkPlate, Validators.maxLength(6), Validators.minLength(6)])]
            });
        }
    }

    ionViewDidLoad() {
        ////****Registry Backbutton Android / WindowsPhone
        this.platform.registerBackButtonAction(() => {
            this.backButtonClick();
        });

        console.log('Hello VehiclePage Page');
        this.getSekewiGlobals();
        this.getSoatGlobals();
    }

    ionViewDidEnter() {
        ////****Set Admob Advertisement
        //AdMob.prepareInterstitial({
        AdMob.prepareRewardVideoAd({
            //adId: 'ca-app-pub-2151147081552695/4926688367',
            adId: 'ca-app-pub-2151147081552695/4507631668',
            autoShow: false
        });
        ////****Add event when user close banner
        document.addEventListener('onAdDismiss', (data) => {
            AdMob.removeBanner();
            //this.navVehicleCtrl.pop();
            //            this.navVehicleCtrl.pop().then(() => this.params.get('resolve')('X'));
        });
    }

    onSubmit() {
        ////****Start loading with 3 seconds after create a vehicle
        let loading = this.loadingCtrl.create({
            content: this.translate.instant('vehicle.ldng_txt_up_vehicle')
        });

        loading.present();

        setTimeout(() => {
            if (!this.platform.is('core')) {
                loading.dismiss().catch(() => { });
                //AdMob.showInterstitial();
                AdMob.showRewardVideoAd();
                this.navVehicleCtrl.pop();
            } else {
                loading.dismiss().catch(() => { });
                this.navVehicleCtrl.pop();
                //                this.navVehicleCtrl.pop().then(() => this.params.get('resolve')('X'));
            }
        }, 3000);

        ////****Upload photos to Firebase DB
        this.uploadToFirebase(listBase64Image[0]);
        /*for (let i = 0; i < listBase64Image.length; i++) {
            //      for(let Img:any: listBase64Image){
            if (listBase64Image[i]) {
                this.uploadToFirebase(listBase64Image[i], i);
            }
        }*/

        ////****Add Vehicle data to Firebase DB
        var fireRef = firebase.database().ref(this.sekewi.Routes.users + this.uid + '/vehicles/');
        fireRef.child(this.formVehicle.value.plate.toLowerCase()).set({
            plate: this.formVehicle.value.plate.toUpperCase(),
            reference: this.formVehicle.value.reference,
            branding: this.formVehicle.value.branding,
            id: this.vchID
        });
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
                if (this.vchID == 1) { this.brandings = data.brandings.motos; }
                else { this.brandings = data.brandings.cars; }
                this.brandings.sort();
            });
    }


    makeFileIntoBlob(_imagePath) {

        ////**** INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        if (this.platform.is('android')) {
            return new Promise((resolve, reject) => {
                window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

                    fileEntry.file((resFile) => {

                        var reader = new FileReader();
                        reader.onloadend = (evt: any) => {
                            var imgBlob: any = new Blob([evt.target.result], {
                                type: 'image/jpeg'
                            });
                            imgBlob.name = 'sample.jpg';
                            resolve(imgBlob);
                        };

                        reader.onerror = (e) => {
                            console.log('Failed file read: ' + e.toString());
                            reject(e);
                        };

                        reader.readAsArrayBuffer(resFile);
                    });
                });
            });
        } else {
            return window.fetch(_imagePath).then((_response) => {
                return _response.blob();
            }).then((_blob) => {
                return _blob;
            }).catch((_error) => {
                alert(JSON.stringify(_error.message));
            });
        }
    }

    uploadToFirebase(_imageBlob) {
        var fileName = "";
        ////****Create File name
        //if (i == 0) {
        fileName = this.formVehicle.value.plate.toLowerCase() + this.soat.ImgNames.soatFront + '.jpg';
        //} 
        /*else {
            fileName = this.formVehicle.value.plate.toLowerCase() + this.soat.ImgNames.soatBack + '.jpg';
        }*/

        ////****console.log("Este es el file name: " + fileName);
        return new Promise((resolve, reject) => {
            var fileRef = firebase.storage().ref(this.sekewi.Routes.images + this.uid + '/' + this.formVehicle.value.plate.toUpperCase() + '/' + fileName);

            var uploadTask = fileRef.put(_imageBlob);

            uploadTask.on('state_changed', (_snapshot) => {
                console.log('snapshot progess ' + _snapshot);
            }, (_error) => {
                reject(_error);
            }, () => {
                // completion...
                resolve(uploadTask.snapshot);
            });
        });
    }

    ////********* oldmethod **************////
    doGetPicture(face) {
        this.soatFace = face;

        /*if (this.soatFace == "front" && this.base64ImageFront != null) {
        } else if (this.soatFace == "back" && this.base64ImageBack != null) {
        } else {*/

        ////****get picture from camera
        Camera.getPicture({
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetHeight: 640,
            correctOrientation: true
        }).then((_imagePath) => {
            //      alert('got image path ' + _imagePath);

            if (this.soatFace == "front") {
                this.base64ImageFront = _imagePath;
                ////****Check if existe image back to put true on checkimage
                if (this.base64ImageBack) {
                    this.ImageCheck = true
                }
            }
            /*else {
                this.base64ImageBack = _imagePath;
                ////****Check if existe image front to put true on checkimage
                if (this.base64ImageFront) {
                    this.ImageCheck = true
                }
            }*/
            ////****convert picture to blob
            return this.makeFileIntoBlob(_imagePath);
        }).then((_imageBlob) => {
            ////****Assing Blob Images to Array
            if (this.soatFace == "front") {
                listBase64Image[0] = _imageBlob;
            }
            /*else {
                listBase64Image[1] = _imageBlob;
            }*/
        }, (_error) => {
            //            alert('Error ' + _error.message);
        });

        //}
    }
    ////********* oldmethod **************////

    backButtonClick() {

        let activePortal = this.ionicApp._loadingPortal.getActive() ||
            this.ionicApp._modalPortal.getActive() ||
            this.ionicApp._toastPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
            activePortal.dismiss();
        } else {
            let options = { Nvch: "X" };
            ////****Show alert before left vehicle page
            let alert = this.alertCtrl.create({
                title: this.translate.instant('global.g_alrt_txt_W_not_save_changes_title'),
                message: this.translate.instant('vehicle.alrt_txt_W_not_save_changes_message'),
                buttons: [
                    {
                        text: this.translate.instant('global.g_btn_txt_cancel')
                    },
                    {
                        text: this.translate.instant('global.g_btn_txt_ok'),
                        handler: () => { this.navVehicleCtrl.pop(); }

                        //                    this.nav.pop().then(() => this.params.get('resolve')('some data'))
                    }
                ]
            });
            alert.present();
        }
    }

}
