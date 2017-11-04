import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SekewiGlobals provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SekewiGlobals {
    private sekewi:any;
  constructor(public http: Http) {
      this.http = http;      
//      console.log('Hello SekewiGlobals Provider');
  }
    

    
   loadSekewiGlobals() {
    if (this.sekewi) {
      return Promise.resolve(this.sekewi);
    }
    // Dont have the data yet, Use json File
    return new Promise(resolve => {
//      this.http.get("../assets/global/globalsekewi.json")
//      this.http.get("../global/globalsekewi.json")
      this.http.get('assets/global/globalsekewi.json')
        .map(res => res.json())
        .subscribe(data => {
          this.sekewi = data.sekewiglobals;
          resolve(this.sekewi);
        });
    });
  } 
    
}
