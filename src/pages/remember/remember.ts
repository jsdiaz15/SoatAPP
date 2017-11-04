import { Component } from '@angular/core';
import { SekewiGlobals } from '../../providers/sekewiglobals';
import { SoatGlobals } from '../../providers/soatglobals';
import { NavController, NavParams, AlertController, ToastController, Platform, IonicApp } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LocalNotifications } from 'ionic-native';
import firebase from 'firebase';

var listPypDates: any[];
//declare var cordova:any;
/*
  Generated class for the Remember page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-remember',
    templateUrl: 'remember.html',
    providers: [SekewiGlobals, SoatGlobals]
})
export class RememberPage {
    public RemindData = {
        soatEnds: '',
        reviewEnds: '',
        taxEnds: '',
        pypStarts: '',
        pypEnds: '',
        pypDay: ''
    };
    public RemindToggle = {
        soat: false,
        review: false,
        tax: false,
        pyp: false
    };
    private alphabet = {
        A: '1', B: '2', C: '3', D: '4', E: '5', F: '6', G: '7', H: '8', I: '9', J: '10',
        K: '11', L: '12', M: '13', N: '14', O: '15', P: '16', Q: '17', R: '18', S: '19',
        T: '20', U: '21', V: '22', W: '23', X: '24', Y: '25', Z: '26'
    };

    private City: any;
    private Uid: string;
    private Plate: string;
    private pypCity: any;
    public sekewi: any;
    private soat: any;
    private vchId: any;
    private eventShoot: number = 0
    private eventShootCheck: number = 0
    private appChanged: boolean = false;
    private appGetData: boolean = false;

    constructor(public navRememberCtrl: NavController, public navParams: NavParams, public sekewiglobals: SekewiGlobals, public soatglobals: SoatGlobals, public translate: TranslateService, public alertCtrl: AlertController,
        public toastCtrl: ToastController, public platform: Platform, private ionicApp: IonicApp) {
        this.platform = platform;
        this.Uid = navParams.get('uid');
        this.Plate = navParams.get('plate');
        this.City = navParams.get('city');
        this.vchId = navParams.get('vchId');
        this.getSekewiGlobals();
        this.getSoatGlobals();
        this.getPypCity(this.City);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RememberPage');
        ////****Registry Backbutton Android / WindowsPhone
        this.platform.registerBackButtonAction(() => {
            this.backButtonClick();
        });


        ////****Get data from Firebase DB
        var starCountRef = firebase.database().ref('users/' + this.Uid + '/remember/' + this.Plate.toLowerCase());
        starCountRef.on('value', (snapshot) => {
            let data = snapshot.val();
            if (data != null) {
                this.RemindData.pypStarts = data.ppm;
                this.RemindData.pypEnds = data.ppa;
                this.RemindToggle.pyp = data.ppc;
                this.RemindData.soatEnds = data.std;
                this.RemindToggle.soat = data.stc;
                this.RemindData.reviewEnds = data.rvd;
                this.RemindToggle.review = data.rvc;
                this.RemindData.taxEnds = data.txd;
                this.RemindToggle.tax = data.txc;
                this.appGetData = true;

                for (let i in this.RemindToggle) {
                    if (this.RemindToggle[i]) { this.eventShoot++; }
                }
            }
        }), ((error) => {
            console.log(error);
        });
    }

    ionViewDidEnter() {
        ////****Configure city
        this.checkCityConfiguration(this.City);
    }

    backButtonClick() {
        ////****Check if there were changes on page
        if (this.appChanged) {
            ////****Save Remember into Firebase
            var fireRef = firebase.database().ref(this.sekewi.Routes.users + this.Uid + '/remember/');
            fireRef.child(this.Plate.toLowerCase()).set({
                ppm: this.RemindData.pypStarts,
                ppa: this.RemindData.pypEnds,
                ppc: this.RemindToggle.pyp,

                std: this.RemindData.soatEnds,
                stc: this.RemindToggle.soat,

                rvd: this.RemindData.reviewEnds,
                rvc: this.RemindToggle.review,

                txd: this.RemindData.taxEnds,
                txc: this.RemindToggle.tax
            });
        }
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
            this.ionicApp._modalPortal.getActive() ||
            this.ionicApp._toastPortal.getActive() ||
            this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
            activePortal.dismiss();
        } else {
            this.navRememberCtrl.pop();
        }

        //this.navRememberCtrl.popAll();

    }

    configureCali(plate: string) {
        ////****Based on Plate number Set Pico y Placa day
        let num = plate.substring(5, 6);

        if (this.pypCity.L.indexOf(num) >= 0) {
            this.RemindData.pypDay = this.translate.instant('global.g_title_txt_weekdays.L');
        } else if (this.pypCity.M.indexOf(num) >= 0) {
            this.RemindData.pypDay = this.translate.instant('global.g_title_txt_weekdays.M');
        } else if (this.pypCity.X.indexOf(num) >= 0) {
            this.RemindData.pypDay = this.translate.instant('global.g_title_txt_weekdays.X');
        } else if (this.pypCity.J.indexOf(num) >= 0) {
            this.RemindData.pypDay = this.translate.instant('global.g_title_txt_weekdays.J');
        } else if (this.pypCity.V.indexOf(num) >= 0) {
            this.RemindData.pypDay = this.translate.instant('global.g_title_txt_weekdays.V');
        }
    }

    ////****Based on city get configuration
    checkCityConfiguration(city: string) {
        switch (city) {
            case 'Cali':
                this.configureCali(this.Plate);
                break;
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

    ////****When toggle is pressed, validate who was pressed
    logEvent(e, event) {
        this.eventShootCheck++; //Just control when user opens this page ()
        if (!this.appGetData) {
            switch (e) {
                case 'pyp':
                    //this.validatePyp(event);
                    if ((event.checked) && (this.RemindData.pypStarts != "" && this.RemindData.pypEnds != "")) {
                        this.validatePyp(event);
                    } else if ((!event.checked) && (this.RemindData.pypStarts != "" && this.RemindData.pypEnds != "")) {
                        this.validatePyp(event);
                    } else if (event.checked) {
                        this.validatePyp(event);
                    }
                    break;
                case 'soat':
                    if ((event.checked) && (this.RemindData.soatEnds != "")) {
                        this.validateSoat(event);
                    } else if ((!event.checked) && (this.RemindData.soatEnds != "")) {
                        this.validateSoat(event);
                    } else if (event.checked) {
                        this.validateSoat(event);
                    }
                    //this.validateSoat(event);
                    //if (event.checked) { this.validateSoat(event); }
                    break;
                case 'review':
                    if ((event.checked) && (this.RemindData.reviewEnds != "")) {
                        this.validateReview(event);
                    } else if ((!event.checked) && (this.RemindData.reviewEnds != "")) {
                        this.validateReview(event);
                    } else if (event.checked) {
                        this.validateReview(event);
                    }
                    //this.validateReview(event);
                    //if (event.checked) { this.validateReview(event); }
                    break;
                case 'tax':
                    if ((event.checked) && (this.RemindData.taxEnds != "")) {
                        this.validateTax(event);
                    } else if ((!event.checked) && (this.RemindData.taxEnds != "")) {
                        this.validateTax(event);
                    } else if (event.checked) {
                        this.validateTax(event);
                    }
                    //this.validateTax(event);
                    //if (event.checked) { this.validateTax(event); }
                    break;
            }
        } else {
            //if (this.eventShootCheck == this.eventShoot) { this.appGetData = false; this.eventShootCheck = 0; this.logEvent(e, event); }
            this.appGetData = false;
            this.eventShootCheck = 0;
            this.logEvent(e, event);
        }
    }
    //Prepare Id for local notifications
    prepareNotifyId(Plate: string, notifyID: number) {
        let id = this.alphabet[Plate.substring(0, 1)] + this.alphabet[Plate.substring(1, 2)] +
            this.alphabet[Plate.substring(2, 3)] + Plate.substring(3, 6) + notifyID;

        return parseInt(id);
    }

    ////****Check if hours setted are good
    checkPypTime() {
        let start: number = parseFloat(this.RemindData.pypStarts.replace(":", "."));
        let end: number = parseFloat(this.RemindData.pypEnds.replace(":", "."));
        if (this.City === 'Cali') {
            ////****Pico y Placa Morning (between 6am - 9am) ~ Afternoon (5pm - 8pm)
            if ((start >= 1.0 && start <= 6.0) && (end >= 9.0 && end <= 17.0)) {
                return true;
            }
            return false;
        }
    }

    ////****Check if deadline is good
    validateDeadline(date: string) {
        let deadline = new Date(date.replace("-", "/"));
        let currentDate = new Date();

        if (deadline.getFullYear() > currentDate.getFullYear()) {
            return true;
        } else {
            if (deadline.getFullYear() == currentDate.getFullYear()) {
                if (deadline.getMonth() > currentDate.getMonth()) {
                    return true;
                } else {
                    if (deadline.getMonth() == currentDate.getMonth()) {
                        if (deadline.getDate() >= currentDate.getDate()) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    ////****Starting to remember Pico y placa
    validatePyp(event: any) {
        ////****Pico y placa filled to create notification (toggle true)
        if ((this.RemindData.pypStarts != '') && (this.RemindData.pypEnds != '') && (this.RemindToggle.pyp == true)) {
            ////****Check if hours are good
            if (this.checkPypTime()) {
                ////****Perapre date formats
                listPypDates = this.calculatePypDay(this.RemindData.pypDay, this.RemindData.pypStarts, this.RemindData.pypEnds);
                ////****Schedule a single notification
                LocalNotifications.schedule([{
                    id: this.prepareNotifyId(this.Plate, 1),
                    text: this.translate.instant('remember.ntfy_txt_pyp') + " " + this.Plate,
                    at: new Date(listPypDates[0]),
                    every: "week",
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    icon: "file://img/notification_icon.png"
                }, {
                    id: this.prepareNotifyId(this.Plate, 2),
                    text: this.translate.instant('remember.ntfy_txt_pyp') + " " + this.Plate,
                    at: new Date(listPypDates[1]),
                    every: "week",
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    icon: "file://img/notification_icon.png"
                }]);

                let toast = this.toastCtrl.create({
                    message: this.translate.instant('remember.alrt_txt_S_remember_pyp_message'),
                    duration: 2000,
                    position: 'bottom'
                });

                toast.present(toast);
                this.appChanged = true;

            } else {
                if (this.City === 'Cali') {
                    //Error, can not start to remember
                    let alert = this.alertCtrl.create({
                        title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                        subTitle: this.translate.instant('remember.alrt_txt_E_not_check_pyp_message'),
                        buttons: [
                            {
                                text: this.translate.instant('global.g_btn_txt_ok'),
                                handler: () => { this.RemindToggle.pyp = false; }
                            }
                        ]
                    });
                    alert.present();
                    //event._checked = false;
                }
            }
        } else if ((this.RemindData.pypStarts != '') && (this.RemindData.pypEnds != '') && (this.RemindToggle.pyp == false)) {
            ////****pico y placa filled and checked false to erase notifycation
            this.RemindToggle.pyp = false;
            LocalNotifications.cancel([this.prepareNotifyId(this.Plate, 1), this.prepareNotifyId(this.Plate, 2)]);
            LocalNotifications.clear([this.prepareNotifyId(this.Plate, 1), this.prepareNotifyId(this.Plate, 2)]);

            let toast = this.toastCtrl.create({
                message: this.translate.instant('remember.alrt_txt_S_remember_forget_message'),
                duration: 2000,
                position: 'bottom'
            });
            toast.present(toast);
            this.appChanged = true;
        } else {
            //Warning, can not start to remember
            let alert = this.alertCtrl.create({
                title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                subTitle: this.translate.instant('remember.alrt_txt_W_not_check_pyp_message'),
                buttons: [
                    {
                        text: this.translate.instant('global.g_btn_txt_ok'),
                        handler: () => { this.RemindToggle.pyp = false; }
                    }]
            });
            alert.present();
            //event._checked = false;
        }
    }

    ////****Starting to remember soat
    validateSoat(event: any) {
        if (this.RemindData.soatEnds != '' && this.RemindToggle.soat == true) {
            if (this.validateDeadline(this.RemindData.soatEnds)) {

                ////Schedule a single notification
                LocalNotifications.schedule({
                    id: this.prepareNotifyId(this.Plate, 3),
                    text: +" " + this.Plate,
                    at: new Date(this.RemindData.soatEnds),
                    every: "year",
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    icon: "file://img/notification_icon.png"
                });

                let toast = this.toastCtrl.create({
                    message: this.translate.instant('remember.alrt_txt_S_remember_soat_message'),
                    duration: 2000,
                    position: 'bottom'
                });

                toast.present(toast);
                this.appChanged = true;
            } else {
                if (this.City === 'Cali') {
                    //Error, can not start to remember
                    let alert = this.alertCtrl.create({
                        title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                        subTitle: this.translate.instant('remember.alrt_txt_E_not_check_soat_message'),
                        buttons: [
                            {
                                text: this.translate.instant('global.g_btn_txt_ok'),
                                handler: () => { this.RemindToggle.soat = false; }
                            }]
                    });
                    alert.present();
                    //event._checked = false;
                }
            }
        } else if (this.RemindData.soatEnds != '' && this.RemindToggle.soat == false) {
            this.RemindToggle.soat = false;
            LocalNotifications.cancel(this.prepareNotifyId(this.Plate, 3));
            LocalNotifications.clear(this.prepareNotifyId(this.Plate, 3));

            let toast = this.toastCtrl.create({
                message: this.translate.instant('remember.alrt_txt_S_remember_forget_message'),
                duration: 2000,
                position: 'bottom'
            });
            toast.present(toast);
            this.appChanged = true;

        } else {
            //Warning, can not start to remember
            let alert = this.alertCtrl.create({
                title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                subTitle: this.translate.instant('remember.alrt_txt_W_not_check_soat_message'),
                buttons: [
                    {
                        text: this.translate.instant('global.g_btn_txt_ok'),
                        handler: () => { this.RemindToggle.soat = false; }
                    }]
            });
            alert.present();
            //event._checked = false;
        }
    }

    ////****Starting to remember techno-mechanic
    validateReview(event: any) {
        if (this.RemindData.reviewEnds != '' && this.RemindToggle.review == true) {

            if (this.validateDeadline(this.RemindData.reviewEnds)) {

                ////Schedule a single notification
                LocalNotifications.schedule({
                    id: this.prepareNotifyId(this.Plate, 4),
                    text: "Delayed Notification Morning",
                    at: new Date(this.RemindData.soatEnds),
                    every: "year",
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    icon: "file://img/notification_icon.png"
                });

                let toast = this.toastCtrl.create({
                    message: this.translate.instant('remember.alrt_txt_S_remember_review_message'),
                    duration: 2000,
                    position: 'bottom'
                });

                toast.present(toast);
                this.appChanged = true;
            } else {
                if (this.City === 'Cali') {
                    //Error, can not start to remember
                    let alert = this.alertCtrl.create({
                        title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                        subTitle: this.translate.instant('remember.alrt_txt_E_not_check_review_message'),
                        buttons: [
                            {
                                text: this.translate.instant('global.g_btn_txt_ok'),
                                handler: () => { this.RemindToggle.review = false; }
                            }]
                    });
                    alert.present();
                    //event._checked = false;
                }
            }
        } else if (this.RemindData.reviewEnds != '' && this.RemindToggle.review == false) {
            this.RemindToggle.review = false;
            LocalNotifications.cancel(this.prepareNotifyId(this.Plate, 4));
            LocalNotifications.clear(this.prepareNotifyId(this.Plate, 4));

            let toast = this.toastCtrl.create({
                message: this.translate.instant('remember.alrt_txt_S_remember_forget_message'),
                duration: 2000,
                position: 'bottom'
            });
            toast.present(toast);
            this.appChanged = true;

        } else {
            //Warning, can not start to remember
            let alert = this.alertCtrl.create({
                title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                subTitle: this.translate.instant('remember.alrt_txt_W_not_check_review_message'),
                buttons: [
                    {
                        text: this.translate.instant('global.g_btn_txt_ok'),
                        handler: () => { this.RemindToggle.review = false; }
                    }]
            });
            alert.present();
            //event._checked = false;
        }
    }

    ////****Starting to remember Taxes
    validateTax(event: any) {
        if (this.RemindData.taxEnds != '' && this.RemindToggle.tax == true) {
            if (this.validateDeadline(this.RemindData.taxEnds)) {

                ////Schedule a single notification
                LocalNotifications.schedule({
                    id: this.prepareNotifyId(this.Plate, 5),
                    text: "Delayed Notification Morning",
                    at: new Date(this.RemindData.soatEnds),
                    every: "year",
                    sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
                    icon: "file://img/notification_icon.png"
                });

                let toast = this.toastCtrl.create({
                    message: this.translate.instant('remember.alrt_txt_S_remember_tax_message'),
                    duration: 2000,
                    position: 'bottom'
                });

                toast.present(toast);
                this.appChanged = true;
            } else {
                if (this.City === 'Cali') {
                    //Error, can not start to remember
                    let alert = this.alertCtrl.create({
                        title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                        subTitle: this.translate.instant('remember.alrt_txt_E_not_check_tax_message'),
                        buttons: [
                            {
                                text: this.translate.instant('global.g_btn_txt_ok'),
                                handler: () => { this.RemindToggle.tax = false; }
                            }]
                    });
                    alert.present();
                    //event._checked = false;
                }
            }
        } else if (this.RemindData.taxEnds != '' && this.RemindToggle.tax == false) {
            this.RemindToggle.tax = false;
            LocalNotifications.cancel(this.prepareNotifyId(this.Plate, 5));
            LocalNotifications.clear(this.prepareNotifyId(this.Plate, 5));

            let toast = this.toastCtrl.create({
                message: this.translate.instant('remember.alrt_txt_S_remember_forget_message'),
                duration: 2000,
                position: 'bottom'
            });
            toast.present(toast);
            this.appChanged = true;

        } else {
            //Warning, can not start to remember
            let alert = this.alertCtrl.create({
                title: this.translate.instant('remember.alrt_txt_W_cannot_notify_title'),
                subTitle: this.translate.instant('remember.alrt_txt_W_not_check_tax_message'),
                buttons: [
                    {
                        text: this.translate.instant('global.g_btn_txt_ok'),
                        handler: () => { this.RemindToggle.tax = false; }
                    }]
            });
            alert.present();
            //event._checked = false;
            //e._checked = false;
        }
    }

    ////****Based on city go to Firebase DB and get default pico y placa
    getPypCity(city: string) {
        if (city === 'Cali') {
            firebase.database().ref('pyp/' + city).once('value').then((snapshot) => {
                this.pypCity = snapshot.val();
                console.log(this.pypCity);
            });
        }
    }

    ////****Get pico y placa day
    calculatePypDay(pypDay: string, pypStarts: string, pypEnds: string) {
        let syDate = new Date();
        console.log(syDate);
        let dates: any[] = [];
        let weekday = syDate.getDay();
        switch (weekday) { ////****Actual Weekday
            case 0:
                ////****Actual Weekday Sunday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }

                break;
            case 1:
                ////****Actual Weekday Monday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
            case 2:
                ////****Actual Weekday Thuesday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
            case 3:
                ////****Actual Weekday Wednesday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
            case 4:
                ////****Actual Weekday Thursday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 1), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
            case 5:
                ////****Actual Weekday Friday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate()), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
            case 6:
                ////****Actual Weekday Saturday
                switch (pypDay) {
                    case this.translate.instant('global.g_title_txt_weekdays.L'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 2), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.M'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 3), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.X'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 4), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.J'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 5), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;

                    case this.translate.instant('global.g_title_txt_weekdays.V'):
                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypStarts.substring(0, 2)), parseInt(pypStarts.substring(3, 5)), 0, 0).toString());

                        dates.push(new Date(syDate.getFullYear(), syDate.getMonth(), (syDate.getDate() + 6), parseInt(pypEnds.substring(0, 2)), parseInt(pypEnds.substring(3, 5)), 0, 0).toString());
                        break;
                }
                break;
        }
        return dates;
    }
}
