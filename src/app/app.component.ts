import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push } from 'ionic-native';
import { HomePage } from '../pages/home/home';
////import { SekewiGlobals } from '../providers/sekewiglobals';
////import { SoatGlobals } from '../providers/soatglobals';
import { PypTask } from '../providers/pyptask';
////import { VehiclePage } from '../pages/vehicle/vehicle';
import firebase from 'firebase';
////import firebase from 'nativescript-plugin-firebase';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
//  providers: [SekewiGlobals, SoatGlobals],
})
export class MyApp {
  rootPage = HomePage;
//    private plattform:any
//    @ViewChild(Nav) nav: Nav;
//  rootPage = VehiclePage;
  constructor(platform: Platform, public alertCtrl: AlertController) {
      //Firebase Api Inicialization
      
//      var that = this;
//    firebase.init({
//      storageBucket: ':https://soatapp-1265.firebaseio.com',
//      persist: true, // optional, default false
//      onAuthStateChanged: function(data) { // optional
//        console.log((data.loggedIn ? "Logged in to firebase" : "Logged out from firebase") + " (init's onAuthStateChanged callback)");
//        if (data.loggedIn) {
//          this.set("useremail", data.user.email ? data.user.email : "N/A");
//        }
//      }
////        commented these so we can wire them via a button
///*
//      onPushTokenReceivedCallback: function(token) {
//        // you can use this token to send to your own backend server,
//        // so you can send notifications to this specific device
//        console.log("Firebase plugin received a push token: " + token);
//      },
//      onMessageReceivedCallback: function(message) {
//        dialogs.alert({
//          title: "Push message: " + (message.title !== undefined ? message.title : ""),
//          message: JSON.stringify(message),
//          okButtonText: "W00t!"
//        });
//      }
//      */
//    }).then((result)=> {
//          console.log("Firebase is ready");
//        },(error)=> {
//          console.log("firebase.init error: " + error);
//        }
//    );

       firebase.initializeApp({
        apiKey: "AIzaSyC0FJYSYcBzRRFnvTxuZ85QEK3AAuAVleU",
        authDomain: "soatapp-1265.firebaseapp.com",
        databaseURL: "https://soatapp-1265.firebaseio.com",
        storageBucket: "soatapp-1265.appspot.com",
        messagingSenderId: "657770190080"
       });
            
//      //Global Variables Inicialization
//       sekewi.getSekewiGlobals();
//       soat.getSoatGlobals();
      
      platform.ready().then(() => {
          
//          this.registerBackButtonListener();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      if(!platform.is('core')){
        this.initPushNotification();
      }
    });  
  }



//registerBackButtonListener() {
//    document.addEventListener('backbutton', () => {
//        var nav = this.getNav();
//        if (nav.canGoBack()) {
//            nav.pop();
//        }
//        else {
//            let activePage = nav.getActive().instance;
//            alert(activePage);
////            if(this.rootPage.indexOf(activePage.constructor.name) > -1) {
////                this.confirmExitApp(nav);
////            }   
////            else {
////                nav.setRoot(this.rootPage);
////            }
//        }
//    });
//}



//***Push notification method
 initPushNotification(){

//
//let push = Push.init({
//    android: {
//        senderID: "657770190080"
//    },
//    ios: {
//        alert: "true",
//        badge: true,
//        sound: 'false'
//    },
//    windows: {}
//});
//
//push.on('registration', (data) => {
//    console.log("Id de registro:" + data.registrationId);
//});
//    
//        
// push.on('notification', (data) => {
//    console.log(data.message);
//    console.log(data.title);
//    console.log(data.count);
//    console.log(data.sound);
//    console.log(data.image);
//    console.log(data.additionalData);
//    
//    
//// let self = this;
// //if user using app and push notification comes
//// if (data.additionalData.foreground) {
//   // if application open, show popup
//   let confirmAlert = this.alertCtrl.create({
//     title: 'New Notification',
//     message: data.message,
//     buttons: [{
//       text: 'Ignore',
//       role: 'cancel'
//     }, {
//       text: 'View',
//       handler: () => {
//         //TODO: method works but is for a independient application
////           let pyptask = new PypTask();
////           console.log(pyptask);
////           pyptask.getParameters(data.additionalData);
//
//       }
//     }]
//   });
//   confirmAlert.present();
//
//    
//});
//
//push.on('error', (e) => {
//    console.log(e.message);
//});
//    
//
//     
//     
//     
//////    if (!this.platform.is('cordova')) {
//////      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
//////      return;
//////    }
////    let push = Push.init({
////      android: {
////        senderID: "657770190080"
////      },
////      ios: {
////        alert: "true",
////        badge: false,
////        sound: "true"
////      },
////      windows: {}
////    });
////     
////     push.on('registration', (data) => {
////      console.log("device token ->", data.registrationId);
////      //TODO - send device token to server
////    });
////    push.on('notification', (data) => {
////      console.log('message', data.message);
////      let self = this;
////      //if user using app and push notification comes
////      if (data.additionalData.foreground) {
////        // if application open, show popup
////        let confirmAlert = this.alertCtrl.create({
////          title: 'New Notification',
////          message: data.message,
////          buttons: [{
////            text: 'Ignore',
////            role: 'cancel'
////          }, {
////            text: 'View',
////            handler: () => {
////              //TODO: Your logic here
////              self.nav.push(HomePage, {message: data.message});
//////              self.HomePage.push(HomePage, {message: data.message});
////            }
////          }]
////        });
////        confirmAlert.present();
////      } else {
////        //if user NOT using app and push notification comes
////        //TODO: Your logic on click of push notification directly
////        self.nav.push(HomePage, {message: data.message});
//////        self.HomePage.push(HomePage, {message: data.message});
////        console.log("Push notification clicked");
////      }
////    });
////    push.on('error', (e) => {
////      console.log(e.message);
////    });
  }  
     
     
     










}
