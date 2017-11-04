import { Component } from '@angular/core';
//import { VehiclePipe } from '../../app/pipes/vehiclepipe.pipe';
import { SekewiGlobals } from '../../providers/sekewiglobals';
import { SoatGlobals } from '../../providers/soatglobals';
import {
    NavController, MenuController, ModalController, AlertController,
    Platform, LoadingController, NavParams, FabContainer
} from 'ionic-angular';
import { VehiclePage } from '../vehicle/vehicle';
import { ServicePage } from '../service/service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Storage } from '@ionic/storage';
import { WslidePage } from '../wslide/wslide';
//import { Push } from 'ionic-native';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';
//interface Window {
//    FirebasePlugin: any;
//}
//declare var cordova:any;
/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/comnavigation.ponents/#navigation for more info on
  Ionic pages and 
*/

//
//interface window extends Window {
//     FirebasePlugin: any;
//}
//
//declare var Window: window;


@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
    providers: [SekewiGlobals, SoatGlobals], //, VehiclePipe
    //providers: [SekewiGlobals, SoatGlobals, VehiclePipe], //, 
    //    pipes: [VehiclePipe],
})

export class DashboardPage {

    blueElement: HTMLElement;
    public UserData: any;
    public UserVehicles: any[] = [];
    private Uid: any;
    public sekewi: any;
    private soat: any;
    private FirebasePlugin: any;
    //    private newVehicle: any;
    rootPage: any;

    constructor(public navDashboardCtrl: NavController, public menuCtrl: MenuController,
        public alertCtrl: AlertController, public sekewiglobals: SekewiGlobals,
        public soatglobals: SoatGlobals, public storage: Storage, public platform: Platform,
        public translate: TranslateService, public loadingCtrl: LoadingController,
        public navParams: NavParams, public modalCtrl: ModalController) {
        this.platform = platform;
        this.FirebasePlugin = Firebase;
        this.UserData = navParams.get('man');
        this.UserVehicles = navParams.get('vch');
        //        this.newVehicle = navParams.get('Nvch');
        //        alert(this.newVehicle);
        //        this.getVehicles();        
        this.getSekewiGlobals();
        this.getSoatGlobals();
    }

    ionViewDidLoad() {
        this.blueElement = document.getElementById('blueScreen');
        ////****Get vehicles   
        //        this.getVehicles();
    }

    ionViewDidEnter() {
        ////****Registry Backbutton Android / WindowsPhone
        this.platform.registerBackButtonAction(() => {
            if (!this.platform.is('core')) {
                this.platform.exitApp();
            }
        });
        ////****If is new, need to set the city
        this.updateCity();
        ////****Get vehicles   
        //        this.getVehicles();

    }

    openMenu() {
        this.menuCtrl.open('0');
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    toggleMenu() {
        console.log("se abrio esta mierda");
        this.menuCtrl.toggle();
    }


    showBlueScreen() {
        //Hide blue screen
        //        if(!this.platform.is('core')){
        if (this.blueElement.className == "blue-screen blue-hide") {
            this.blueElement.className = "blue-screen blue-show";
        } else {
            this.blueElement.className = "blue-screen blue-hide";
        }
        //        }
    }

    goToVehicle(vchID: number, fab: FabContainer) {
        ////****Go to next page vehicle with params  
        //        new Promise((resolve, reject) => {
        //            this.navDashboardCtrl.push(VehiclePage, {uid: this.UserData.Uid, vehicleID: vchID});
        //        }).then(data => {
        //        // process data
        //            alert(data);
        //        });
        this.blueElement.className = "blue-screen blue-hide";
        fab.close();
        this.getVehicles();

        this.navDashboardCtrl.push(VehiclePage, {
            uid: this.UserData.Uid,
            vehicleID: vchID
        });
    }

    goToService(plate: any, vchId: any) {
        ////****Go to next page service
        this.navDashboardCtrl.push(ServicePage, {
            plate: plate,
            uid: this.UserData.Uid,
            vchId: vchId
        });
    }

    //    getUser() {
    ////        ////****Get current logged user
    ////        firebase.auth().onAuthStateChanged((user) => {
    ////            if (user) {
    ////                //// User is signed in.
    ////                this.User  = user.displayName;
    ////                this.Email = user.email;
    ////                this.Photo = user.photoURL;
    ////                this.UserData.Uid   = user.uid;
    ////            } else {
    ////                //// No user is signed in.
    ////            }
    ////        });
    //
    //    }
    getVehicles() {
        ////****Get user vehicles to create a list
        console.log("users/" + this.UserData.Uid + '/vehicles');
        this.UserVehicles.length = 0;
        //        if (this.UserVehicles == null || this.UserVehicles.length == 0) {            
        var starCountRef = firebase.database().ref('users/' + this.UserData.Uid + '/vehicles');
        starCountRef.on('value', (snapshot) => {
            let vehicles = snapshot.val();
            this.UserVehicles.length = 0;
            for (let i in vehicles) {
                this.UserVehicles.push(vehicles[i]);
            }
        }), ((error) => {
            console.log(error);
        });
        //        }
    }


    updateCity() {
        ////****Get internal storage variable to know if user logged frist time (Get user city)
        this.storage.get('launchCount').then(applaunchCount => {
            if (applaunchCount == 1) {
                //logged frist time show country radio
                this.showCountryRadio();
            } else {
                if (this.UserVehicles.length == 0) {
                    this.getVehicles();
                }

            }
        }).catch((error: any) => {
            console.log(error);
        });
    }


    logout() {

        let logoutConfirm = this.alertCtrl.create({
            title: this.translate.instant('dashboard.menu_txt_user_logout'),
            message: this.translate.instant('dashboard.alrt_txt_W_logout_message'),
            buttons: [
                {

                    text: this.translate.instant('global.g_btn_txt_cancel'),
                    handler: () => { }
                },
                {
                    text: this.translate.instant('global.g_btn_txt_ok'),
                    handler: () => {
                        let loading = this.loadingCtrl.create({
                            content: this.translate.instant('dashboard.ldng_txt_logging_out')
                        });

                        loading.present();

                        setTimeout(() => {
                            //Logout application
                            firebase.auth().signOut().then(() => {
                                // Sign-out successful.
                                this.storage.set('launchCount', 3);
                                loading.dismiss().catch(() => { });
                                this.navDashboardCtrl.pop();
                                window.location.reload();
                            }, (error) => {
                                console.log(error);
                                // An error happened.
                            });
                        }, 2000);

                    }
                }
            ]
        });
        logoutConfirm.present();
    }

    tutorialShow() {
        let modal = this.modalCtrl.create(WslidePage);
        modal.present();
    }

    showCityRadio(country: string) {
        let alert = this.alertCtrl.create();
        alert.setTitle(this.translate.instant('global.g_select_title'));
        switch (country) {
            case 'Colombia':
                for (let i = 0; i < this.soat.cities.Colombia.length; i++) {
                    alert.addInput({
                        type: this.sekewi.Types.radio,
                        label: this.soat.cities.Colombia[i],
                        value: this.soat.cities.Colombia[i],
                    });
                }
                break;

        }

        alert.addButton({
            text: this.translate.instant('global.g_btn_txt_cancel'),
            handler: data => {
                this.showCityRadio(country);
                //        this.testRadioOpen = false;
                //        this.testRadioResult = data;
            }
        });

        alert.addButton({
            text: this.translate.instant('global.g_btn_txt_ok'),
            handler: data => {
                ////****Add User property to Firebase DB
                if (!this.platform.is('core')) {
                    this.FirebasePlugin.prototype.setUserProperty("Ciudad", data);
                    console.log("Property Sended: " + data);
                }
                ////****Add city value to FireBase DB
                var updates = {};
                updates['/city'] = data;
                firebase.database().ref(this.sekewi.Routes.users + this.UserData.Uid).update(updates);
                this.storage.set('launchCount', 2);

                ////**** Show Tutorial
                this.tutorialShow();
            }
        });
        alert.present();
    }



    showCountryRadio() {
        let alert = this.alertCtrl.create();
        alert.setTitle(this.translate.instant('global.g_select_title_country'));
        for (let i = 0; i < this.soat.countries.length; i++) {
            alert.addInput({
                type: this.sekewi.Types.radio,
                label: this.soat.countries[i],
                value: this.soat.countries[i],
                //          checked: true
            });
        }
        alert.addButton({
            text: this.translate.instant('global.g_btn_txt_cancel'),
            handler: data => {
                this.showCountryRadio();
                //        this.testRadioOpen = false;
                //        this.testRadioResult = data;
            }
        });

        alert.addButton({
            text: this.translate.instant('global.g_btn_txt_ok'),
            handler: data => {
                //				console.log("La ciudad" + data);
                var updates = {};
                updates['/country'] = data;
                firebase.database().ref(this.sekewi.Routes.users + this.UserData.Uid).update(updates);
                this.showCityRadio(data);
                //				this.storage.set('launchCount', 2);
            }
        });
        alert.present();
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


    pressVehicleEvent(e) {
        console.log("Pressed");
    }



    editItem(item) {

        //    for(let i = 0; i < this.items.length; i++) {
        // 
        //      if(this.items[i] == item){
        //        this.items.splice(i, 1);
        //      }
        // 
        //    }

    }

    deleteItem(item) {
        var desertRef;
        let index = this.UserVehicles.indexOf(item);
        ////****delete from Firebase DB
        firebase.database().ref(this.sekewi.Routes.users + this.UserData.Uid + '/remember/' + item.plate.toLowerCase()).remove();
        firebase.database().ref(this.sekewi.Routes.users + this.UserData.Uid + '/vehicles/' + item.plate.toLowerCase()).remove();
        ////****Create a reference to the file to delete from Firebase Storage
        for (let i = 0; i < 2; i++) {
            if (i == 0) {
                desertRef = firebase.storage().ref().child(this.sekewi.Routes.images + this.UserData.Uid + '/' + item.plate + '/' + item.plate.toLowerCase() + this.soat.ImgNames.soatFront + '.jpg');
            } else {
                desertRef = firebase.storage().ref().child(this.sekewi.Routes.images + this.UserData.Uid + '/' + item.plate + '/' + item.plate.toLowerCase() + this.soat.ImgNames.soatBack + '.jpg');
            }
            ////****Delete the file
            desertRef.delete().then(() => {
                ////****File deleted successfully
            }).catch((error) => {
                console.log(error);
                ////****Uh-oh, an error occurred!
            });
        }
        ////****Delete item from vehicles 
        ////         this.UserVehicles.length = 0;
        delete this.UserVehicles[index];

        ////****Get Vehicles
        this.getVehicles();
    }

    removeItem(item) {
        ////****Create Alert To confirm is user wants to delete 
        let confirm = this.alertCtrl.create({
            title: this.translate.instant('global.g_btn_txt_delete'),
            message: this.translate.instant('dashboard.alrt_txt_W_delete'),
            buttons: [
                {
                    text: this.translate.instant('global.g_btn_txt_cancel'),
                    handler: () => { }
                },
                {
                    text: this.translate.instant('global.g_btn_txt_ok'),
                    handler: () => {
                        this.deleteItem(item);
                    }
                }]
        });
        confirm.present();
    }


}
