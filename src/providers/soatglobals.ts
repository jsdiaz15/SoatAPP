import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SekewiGlobals provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SoatGlobals {
    private soat:any;
  constructor(public http: Http) {
      this.http = http;      
//      console.log('Hello SekewiGlobals Provider');
  }
    

    
   loadSoatGlobals() {
    if (this.soat) {
      return Promise.resolve(this.soat);
    }
    // Dont have the data yet, Use json File
    return new Promise(resolve => {
//      this.http.get("../assets/global/globalsoat.json")
//      this.http.get("../global/globalsoat.json")
      this.http.get("assets/global/globalsoat.json")
        .map(res => res.json())
        .subscribe(data => {
          this.soat = data.soatglobals;
          resolve(this.soat);
        });
    });
  } 
    
}

