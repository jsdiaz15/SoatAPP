import { Component } from '@angular/core';
import { SekewiGlobals } from '../../providers/sekewiglobals';
import { SoatGlobals } from '../../providers/soatglobals';
import { VehiclePipe } from '../../app/pipes/vehiclepipe.pipe';
import { NavController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'; //FormControl,
import { TranslateService } from 'ng2-translate/ng2-translate';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';

/*
  Generated class for the Registry page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation. 
*/
@
Component({
	selector: 'page-registry',
	templateUrl: 'registry.html',
	providers: [SekewiGlobals, SoatGlobals]
})
export class RegistryPage {
	public registryform: FormGroup;
	public sekewi: any;
	private soat: any;
	public cities: any;
	public countries: any;
    private FirebasePlugin: any;
	constructor(public navCtrl: NavController, public viewCtrl: ViewController, fb: FormBuilder, private alertCtrl: AlertController, public translate: TranslateService, public sekewiglobals: SekewiGlobals, public soatglobals: SoatGlobals) {
        this.FirebasePlugin = Firebase;
		this.registryform = fb.group({
			"name": ['', Validators.required],
			"lastname": ['', Validators.required],
			"email": ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
			"password": ['', [Validators.required, Validators.minLength(8)]],
			"city": ['', Validators.required],
			"country": ['', Validators.required],
		});
        
        this.getSekewiGlobals();
		this.getSoatGlobals();
	}
    
	ionViewDidLoad() {
//		console.log('Hello RegistryPage Page');
//        this.getSekewiGlobals();
//		this.getSoatGlobals();
	}
    
	dismiss() {
		this.viewCtrl.dismiss();
	}
    
	showErrorAlert() {
		let alert = this.alertCtrl.create({
			title: this.translate.instant('registry.alrt_txt_E_registry_title'),
			subTitle: this.translate.instant('registry.alrt_txt_E_registry_message') + " " + this.registryform.value.email,
			buttons: [this.translate.instant('global.g_btn_txt_ok')]
		});
		alert.present();
	}
    
	showSuccessAlert() {
		let alert = this.alertCtrl.create({
			title: this.translate.instant('registry.alrt_txt_S_registry_title'),
			subTitle: this.translate.instant('registry.alrt_txt_S_registry_message'),
			buttons: [this.translate.instant('global.g_btn_txt_ok')]
		});
		alert.present();
	}
    
	onSubmit() {
		console.log("model-based form submitted");
		console.log(this.registryform);
        //Registry user in firebase
		firebase.auth().createUserWithEmailAndPassword(this.registryform.value.email, this.registryform.value.password).then((success) => {
			//Add new User to Firebase DB through form
			firebase.database().ref('users/' + success.uid).set({
				username: this.registryform.value.name + " " + this.registryform.value.lastname,
				email: this.registryform.value.email,
				city: this.registryform.value.city,
				country: this.registryform.value.country,
				profilePhoto: ""
			});
			this.dismiss();
            //Add city property to Firebase DB
            this.FirebasePlugin.prototype.setUserProperty("Ciudad", this.registryform.value.city);
			this.showSuccessAlert();
		}).catch((error: any) => {
			if(error.code == this.sekewi.errorCodes.email) {
				this.showErrorAlert();
			}
		});
	}
    
	getSekewiGlobals() {
		this.sekewiglobals.loadSekewiGlobals().then((data) => {
			this.sekewi = data;
		});
	}
    
	getSoatGlobals() {
		this.soatglobals.loadSoatGlobals().then((data) => {
			//    this.soat = data;
			this.soat = data;
			this.cities = data.cities;
			this.countries = data.countries;
		});
	}
}