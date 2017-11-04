
import { FormControl } from '@angular/forms';
// import { Control } from "angular/common";

interface ValidationResult {
      [key: string]: any;
}

export class PlateValidator {

    static checkPlate(control: FormControl): ValidationResult {

        let plate1 = control.value.substr(0, 3);
        let plate2 = control.value.substr(3, 5);
        if (isNaN(plate2)) {
            return {
                "not a number": true
            };
        }
            
        if (!isNaN(plate1)) {
            return {
                "not a plate": true
            };
        }
        
//        if(/^[a-zA-Z0-9- ]*$/.test(plate1) == false) {
        if(/^[a-zA-Z_\-]+$/.test(plate1) == false) {
//            alert('Your search string contains illegal characters.');
             return {
                "not a number": true
            };
        }
        
        if(/^[0-9]+$/.test(plate2) == false) {
//            alert('Your search string contains illegal characters.');
             return {
                "not a number": true
            };
        }
        
        
        
        
        

        //        return (control.value);
        return null;
    }


    static checkPlateMoto(control: FormControl): ValidationResult {

        let plate1 = control.value.substr(0, 3);
        let plate2 = control.value.substr(3, 2);
        let plate3 = control.value.substr(5, 1);

        if (isNaN(plate2)) {
            return {
                "not a number": true
            };
        }
        if (!isNaN(plate1)) {
            return {
                "not a plate": true
            };
        }

        //****if is a number(just put something like that ABC12)
        if (!isNaN(plate3)) {
            if (plate3 === "" || plate3 === " ") {} else {
                return {
                    "not a number": true
                };
            }
        }
        
        
        if(/^[a-zA-Z_\-]+$/.test(plate1) == false) {
//            alert('Your search string contains illegal characters.');
             return {
                "not a plate": true
            };
        }
        
        if(/^[0-9]+$/.test(plate2) == false) {
//            alert('Your search string contains illegal characters.');
             return {
                "not a number": true
            };
        }

        return null;
    }



}