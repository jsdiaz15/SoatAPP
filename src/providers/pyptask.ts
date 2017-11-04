//import { Alert, Modal, NavController, Page } from 'ionic-angular';
//import { Component } from '@angular/core';
import firebase from 'firebase';


export class PypTask {
//  progress: number = 0;
//  private City:any;
//    private daysData:any;    
//    private daysDataTemp:any;
  
constructor() { }
	
getParameters(addData:any){
//    this.getPicoyPlaca(addData.city).then((pypData:any) => {
//    let days:any;
        if(addData.city === 'cali'){
            firebase.database().ref('pyp/' + addData.city).once('value').then((snapshot)=> {
//            let daysData:any = JSON.stringify(snapshot.val());  
                return snapshot.val();  
             }).then((days:any) => {
                let pypDataTemp = days;
                
                
                var updates = {};
                updates['/L'] = pypDataTemp.V;
                firebase.database().ref('pyp/' + addData.city).update(updates);
                updates = {};
                 updates['/M'] = pypDataTemp.L;
                firebase.database().ref('pyp/' + addData.city).update(updates);
                updates = {};
                 updates['/X'] = pypDataTemp.M;
                firebase.database().ref('pyp/' + addData.city).update(updates);
                updates = {};
                 updates['/J'] = pypDataTemp.X;
                firebase.database().ref('pyp/' + addData.city).update(updates);
                updates = {};
                 updates['/V'] = pypDataTemp.J;
                firebase.database().ref('pyp/' + addData.city).update(updates);
                updates = {};
                
//                
//      
//                days.L = pypDataTemp.V;
//                days.M = pypDataTemp.L;
//                days.X = pypDataTemp.M;
//                days.J = pypDataTemp.X;
//                days.V = pypDataTemp.J;
//
//                console.log(days.L);
//                console.log(days.M);
//                console.log(days.X);
//                console.log(days.J);
//                console.log(days.V);
            });
        }

//  }); 
}
//	test1() {
//	  this.progress = 0;
//	  this.getPromise().then(this.testMethod);
//	}
	
//	test2() {
//	  this.progress = 0;
//	  this.getPromise().then(() => this.updatePicoyPlaca());
//	}
	
	getPicoyPlaca(city:string) {
        let days:any;
        if(city === 'cali'){
            firebase.database().ref('pyp/' + city).once('value').then((snapshot)=> {
//            let daysData:any = JSON.stringify(snapshot.val());  
            return days = snapshot.val();  
             }); 
        }
//        return days;  
	}
	
	getPromise() {
	  return new Promise((resolve, reject) => {
	    setTimeout(resolve, 500);
	  });
	}
	
//	toString() {
//	  return '[object ' + this.constructor.name + ']';
//	}
	
//	static log(value) {
//	  let el = document.getElementById('console');
//	  
//	  el.innerText += (value.toString() + '\n');
//	  el.scrollTop = el.scrollHeight;
//	  
//	  console.log(value);
//	}
	
//	static clear() {
//	  document.getElementById('console').innerText = '';
//	}
}