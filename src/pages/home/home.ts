import { Component } from '@angular/core';
import { SekewiGlobals } from '../../providers/sekewiglobals';
////import { SoatGlobals } from '../../providers/soatglobals';
import { NavController, ModalController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { RegistryPage } from '../registry/registry';
import { DashboardPage } from '../dashboard/dashboard';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GooglePlus, Facebook } from 'ionic-native';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [SekewiGlobals] //, SoatGlobals
})
export class HomePage {
    //   private userProfile: any = null;
    //  private email = new FormControl("", Validators.required);
    public form: FormGroup;
    private provider: any = null;
    public sekewi: any;
    private UserVehicles: any[] = [];
    private starCountRef;
    private AppCount: number;
    private man = { User: '', Email: '', Photo: '', Uid: '' };
    //  private soat:any;

    //  private loader:any;


    constructor(public navCtrl: NavController, public translate: TranslateService, public modalCtrl: ModalController, fb: FormBuilder, private alertCtrl: AlertController, public platform: Platform, public loadingCtrl: LoadingController, public sekewiglobals: SekewiGlobals, public storage: Storage) {

        var userLang = navigator.language.split('-')[0];
        userLang = /(es)/gi.test(userLang) ? userLang : 'es';
        //userLang = /(es|en)/gi.test(userLang) ? userLang : 'es'; //Comment because there is not english trnaslation yet
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('es');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(userLang);

        this.form = fb.group({
            "email": ['', [Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'), Validators.required]],
            "password": ['', [Validators.minLength(8), Validators.pattern('^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$'), Validators.required]]
        });
        ////Get device
        this.platform = platform;

    }

    ionViewDidLoad() {
        console.log("Hello ionViewDidLoad");

        ////Get sekewi Global variables
        this.getSekewiGlobals();

        this.storage.get('launchCount').then(applaunchCount => {
            this.AppCount = applaunchCount
            this.checkLogin();
        }).catch((error: any) => {
            console.log(error);
        });


        ////     this.getSoatGlobals();
    }

    ionViewDidEnter() {
        ////Check Autologin
        //        this.checkLogin();
    }


    ////Submit User login form
    onSubmit() {
        ////Login through email and password
        firebase.auth().signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
            .then((success) => {

                this.goToDashboard();
                ////        this.navCtrl.push(DashboardPage);
            })
            .catch((error: any) => {
                this.showErrorAlert(error.code);
            });
    }


    presentModal() {
        ////Present registry modal
        let modal = this.modalCtrl.create(RegistryPage);
        modal.present();
    }
    goToDashboard() {
        ////Go to next page
        this.navCtrl.push(DashboardPage, { man: this.man, vch: this.UserVehicles });
        //        this.navCtrl.push(DashboardPage, {man: this.man, vch: this.starCountRef});
        //        this.navCtrl.push(DashboardPage, {man: this.man});
    }

    showErrorAlert(code: string) {
        if (code == this.sekewi.errorCodes.user) {
            let alert = this.alertCtrl.create({
                title: this.translate.instant('home.alrt_txt_E_login_title'),
                subTitle: this.translate.instant('home.alrt_txt_E_login_message'),
                buttons: [this.translate.instant('global.g_btn_txt_ok')]
            });
            alert.present();
        } else if (code == this.sekewi.errorCodes.password) {
            let alert = this.alertCtrl.create({
                title: this.translate.instant('home.alrt_txt_E_login_title'),
                subTitle: this.translate.instant('home.alrt_txt_E_login_message2'),
                buttons: [this.translate.instant('global.g_btn_txt_ok')]
            });
            alert.present();
        }
    }


    ////********* Start Facebook Login
    facebookLogin() {
        ////******* Facebook Web Login
        this.provider = new firebase.auth.FacebookAuthProvider();
        this.provider.addScope('public_profile, email');

        if (this.platform.is('core')) {
            //// This login will use only in desktop app
            firebase.auth().signInWithPopup(this.provider)
                .then((result) => {
                    this.addData(result);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        } else {

            ////******Facebook Mobile Login  
            Facebook.login(['email', 'public_profile']).then((response) => {
                if (response.status === 'connected') {
                    let facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
                    firebase.auth().signInWithCredential(facebookCredential)
                        .then((success) => {
                            ////                console.log("Facebook User:" + JSON.stringify(success));
                            this.addData(success);
                        })
                        .catch((error) => {
                            console.log("Fallas en cantidades alarmantes 1: " + error);
                        });
                } else {
                    console.log('Facebook login failed');
                }
            }).catch((error) => {
                console.log("Fallas en cantidades alarmantes 2: " + error);
            });


        }
    }

    //////********* Start Google Plus Login
    googleLogin() {
        ////******** Google Plus web Login
        this.provider = new firebase.auth.GoogleAuthProvider();
        this.provider.addScope('profile');
        this.provider.addScope('email');

        if (this.platform.is('core')) {

            firebase.auth().signInWithPopup(this.provider)
                .then((result) => {
                    this.addData(result);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        } else {
            ////******** Google Plus mobile Login
            GooglePlus.login({
                'scopes': 'email profile',
                'webClientId': '657770190080-2piogrqvmjdvo15ecae4ipbrif4i51e9.apps.googleusercontent.com',
                'offlineAccess': true
            })
                .then((response) => {

                    let googleCredential = firebase.auth.GoogleAuthProvider.credential(response.idToken, response.accessToken);
                    firebase.auth().signInWithCredential(googleCredential)
                        .then((success) => {
                            ////              console.log("Google Plus User:" + JSON.stringify(success));
                            ////              this.addData(JSON.stringify(success));
                            this.addData(success);
                        })
                        .catch((error) => {
                            console.log("Fallas en cantidades alarmantes 1: " + error);
                        });
                })
                .catch((error) => {
                    console.log("Fallas en cantidades alarmantes 2: " + error);
                });
        }
    }


    ////set Object Properties
    setMan(Man: any, count: number) {
        if (this.platform.is('core') && count == 1) {
            this.man.User = Man.user.displayName;
            this.man.Email = Man.user.email;
            this.man.Photo = Man.user.photoURL;
            this.man.Uid = Man.user.uid;
        }
        else if ((!this.platform.is('core')) && count == 1) {
            this.man.User = Man.displayName;
            this.man.Email = Man.email;
            this.man.Photo = Man.photoURL;
            this.man.Uid = Man.uid;
        }

        else if (this.platform.is('core') && count >= 2) {
            this.man.User = Man.user.displayName;
            this.man.Email = Man.user.email;
            this.man.Photo = Man.user.photoURL;
            this.man.Uid = Man.user.uid;
        }
        else if ((!this.platform.is('core')) && count >= 2) {
            this.man.User = Man.displayName;
            this.man.Email = Man.email;
            this.man.Photo = Man.photoURL;
            this.man.Uid = Man.uid;

        }

        /*else if (count >= 2) {
            this.man.User = Man.displayName;
            this.man.Email = Man.email;
            this.man.Photo = Man.photoURL;
            this.man.Uid = Man.uid;
        }*/
    }

    getVehicles(Man: any, count: number) {
        let loader = this.loadingCtrl.create({
            content: this.translate.instant('home.ldng_txt_check_login'),
        });
        loader.present();


        if (this.platform.is('core') && count == 1) {
            this.starCountRef = firebase.database().ref('users/' + Man.user.uid + '/vehicles');
        }
        else if ((!this.platform.is('core')) && count == 1) {
            this.starCountRef = firebase.database().ref('users/' + Man.uid + '/vehicles');
        }
        else if (count >= 2) {
            this.starCountRef = firebase.database().ref('users/' + Man.uid + '/vehicles');
        }

        this.starCountRef.once('value').then((snapshot) => {

            this.UserVehicles.length = 0; //When recharge 
            let vehicles = snapshot.val();
            for (let i in vehicles) {
                this.UserVehicles.push(vehicles[i]);
            }

            ////Go to Next Page     
            loader.dismiss().catch(() => { });
            this.goToDashboard();

        });

        //        starCountRef.on('value', (snapshot) => {
        //            let vehicles = snapshot.val();
        //            //Check if vehicles is filled(erase, probably is a change (add or delete))
        //            if(this.UserVehicles.length > 0){this.UserVehicles.length = 0;}
        //            for (let i in vehicles) {
        //                this.UserVehicles.push(vehicles[i]);
        //            }
        //             ////Go to Next Page        
        //             this.goToDashboard();
        //            
        //            
        //        }), ((error) => {
        //            console.log(error);
        //        });

    }


    ////
    addData(success: any) {
        //        this.storage.get('launchCount').then(applaunchCount => {
        console.log("Count at this moment: " + this.AppCount);
        if (this.AppCount == null) {
            let starCountRef;
            ////First time login into soat app                
            if (this.platform.is('core')) {
                starCountRef = firebase.database().ref(this.sekewi.Routes.users + success.user.uid);
            } else {
                starCountRef = firebase.database().ref(this.sekewi.Routes.users + success.uid);
            }
            //                 starCountRef.child('users').child(userId).once('value', function(snapshot) {
            //                starCountRef.on('value', (snapshot) => {
            starCountRef.once('value').then((snapshot) => {
                var exists = (snapshot.val() !== null);
                if (exists) {
                    //User is logged from another device
                    this.storage.set('launchCount', 2);
                    this.setMan(success, 2);
                    this.goToDashboard();
                } else {
                    ////add Data to Firebase    
                    if (this.platform.is('core')) {
                        ////Web
                        firebase.database().ref(this.sekewi.Routes.users + success.user.uid).set({
                            username: success.user.displayName,
                            email: success.user.email,
                            country: "",
                            city: "",
                            profilePhoto: success.user.photoURL
                        });
                        this.setMan(success, 1);
                    } else {
                        ////Mobile
                        console.log("Mobile: " + success);
                        firebase.database().ref(this.sekewi.Routes.users + success.uid).set({
                            username: success.displayName,
                            email: success.email,
                            country: "",
                            city: "",
                            profilePhoto: success.photoURL
                        });
                        this.setMan(success, 1);
                    }

                    ////internal storage variable to identify logged already
                    this.storage.set('launchCount', 1);
                    this.getVehicles(success, 1);
                    //                        this.goToDashboard();

                }
            });



            //
            //                                ////Could be the first time login
            //                                if (this.platform.is('core')) {
            //                                    ////Check if user erase cache files and exist in database
            //                                    ////Web
            //                //                    let starCountRef = firebase.database().ref(this.sekewi.Routes.users);
            //                //                    starCountRef.child(success.user.uid).once('value', (snapshot)=> {
            //                                    let starCountRef = firebase.database().ref(this.sekewi.Routes.users + success.user.uid);
            //                                    starCountRef.on('value', (snapshot) => {
            //                                        // let UserProfile = snapshot.val();
            //                                        if (snapshot.val() !== null || snapshot.val() !== 'undefined') {
            //                                            this.storage.set('launchCount', 1);
            //                                            this.goToDashboard();
            //                                        } else {
            //                                            //Firs time into App, Save data on Firebase
            //                                            ////Web
            //                                            firebase.database().ref(this.sekewi.Routes.users + success.user.uid).set({
            //                                                username: success.user.displayName,
            //                                                email: success.user.email,
            //                                                country: "",
            //                                                city: "",
            //                                                profilePhoto: success.user.photoURL
            //                                            });
            //                
            //                                        }
            //                                    }), ((error) => {
            //                                        console.log(error);
            //                                    });
            //                
            //                                } else {
            //                                    ////Mobile
            //                                    let starCountRef = firebase.database().ref(this.sekewi.Routes.users + success.uid);
            //                                    starCountRef.on('value', (snapshot) => {
            //                                        //						let UserProfile = snapshot.val();
            //                                        if (snapshot.val() !== null || snapshot.val() !== 'undefined') {
            //                                            this.storage.set('launchCount', 1);
            //                                            this.goToDashboard();
            //                                        } else {
            //                                            //Firs time into App, Save data on Firebase    
            //                                            ////Mobile
            //                                            console.log("Mobile: " + success);
            //                                            firebase.database().ref(this.sekewi.Routes.users + success.uid).set({
            //                                                username: success.displayName,
            //                                                email: success.email,
            //                                                country: "",
            //                                                city: "",
            //                                                profilePhoto: success.photoURL
            //                                            });
            //                                        }
            //                                    }), ((error) => {
            //                                        console.log(error);
            //                                    });
            //                                }

        } else if (this.AppCount == 3) {
            ////LogOut and intent login again
            let loader = this.loadingCtrl.create({
                content: this.translate.instant('home.ldng_txt_check_login'),
            });
            loader.present();
            this.storage.set('launchCount', 2);
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.man.User = user.displayName;
                    this.man.Email = user.email;
                    this.man.Photo = user.photoURL;
                    this.man.Uid = user.uid;
                    this.setMan(user, this.AppCount);
                    this.getVehicles(user, this.AppCount);
                    loader.dismiss().catch(() => { });
                    //                        this.goToDashboard();
                }
            });

        }
        //            else {
        //                ////First time login into soat app
        //                ////add Data to Firebase    
        //                if (this.platform.is('core')) {
        //                    ////Web
        //                    firebase.database().ref(this.sekewi.Routes.users + success.user.uid).set({
        //                        username: success.user.displayName,
        //                        email: success.user.email,
        //                        country: "",
        //                        city: "",
        //                        profilePhoto: success.user.photoURL
        //                    });
        //                } else {
        //                    ////Mobile
        //                    console.log("Mobile: " + success);
        //                    firebase.database().ref(this.sekewi.Routes.users + success.uid).set({
        //                        username: success.displayName,
        //                        email: success.email,
        //                        country: "",
        //                        city: "",
        //                        profilePhoto: success.photoURL
        //                    });
        //
        //                }
        //
        //                ////internal storage variable to identify logged already
        //                this.storage.set('launchCount', 1);
        //                ////Go to Next Page        
        //                this.goToDashboard();
        //            }
        //        }).catch((error: any) => {
        //            console.log(error);
        //        });

    }


    getSekewiGlobals() {
        ////Get Sekewi Global variables
        this.sekewiglobals.loadSekewiGlobals()
            .then((data) => {
                this.sekewi = data;
            });
    }

    ////getSoatGlobals(){
    ////  this.soatglobals.loadSoatGlobals()
    ////      .then((data) => {
    ////    this.soat = data;
    ////  });
    ////}



    checkLogin() {
        ////Checking Autologin
        /*let loader = this.loadingCtrl.create({
            content: this.translate.instant('home.ldng_txt_check_login'),
        });
        loader.present();*/

        //        this.storage.get('launchCount').then(applaunchCount => {
        //            console.log(applaunchCount);
        if (this.AppCount == 2) {
            ////logged Already
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    //loader.dismiss().catch(() => { });
                    //                        this.man.User  =  user.displayName;
                    //                        this.man.Email =  user.email;
                    //                        this.man.Photo =  user.photoURL;
                    //                        this.man.Uid   =  user.uid;
                    this.setMan(user, this.AppCount);
                    this.getVehicles(user, this.AppCount);
                    //                        this.goToDashboard();
                }
            });
        }
        //        }).catch((error: any) => {
        //            console.log(error);
        //        });

        //
    }





    ////////ionViewCanLeave() {
    //////  console.log("Should I leave? No");
    ////////  if (!this.platform.is('core')) {
    ////////    return false;
    ////////  }
    ////////    
    ////////}



    ////////ionViewWillLeave() {
    ////////     this.navCtrl.pop();
    ////////    console.log("Looks like I'm about to leave :(");
    ////////  }



}