
import { FormControl } from '@angular/forms';
// import { Control } from "angular/common";

  interface ValidationResult {
      [key:string]:any;
    }

    export class PhoneValidator {

      static checkPhone(control: FormControl): ValidationResult {
          
        let phone = control.value;
        if(isNaN(phone)){
            return {
                "not a number": true
            };
        }
//        if(!isNaN(plate1)){
//            return {
//                "not a plate": true
//            };
//        }  
          
//        return (control.value);
        return null;
      }
    }




//import { FormControl } from '@angular/forms';
// 
//export class PlateValidator {
// 
//    static checkPlate(control: FormControl): any {
//        let plate1 = control.value.substr(0, 3);
//        let plate2 = control.value.substr(3, 5);
//        if(isNaN(plate2)){
//            return {
//                "not a number": true
//            };
//        }
// 
//        if(!isNaN(plate1)){
//            return {
//                "not a plate": true
//            };
//        }
// 
////        if(control.value < 18){
////            return {
////                "too young": true
////            };
////        }
//// 
////        if (control.value > 120){
////            return {
////                "not realistic": true
////            };
////        }
// 
//        return null;
////        return {"success": true};
////        return control;
//    }
// 
//}