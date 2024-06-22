import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CustomValidatorService {
    passwordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            // At least one upper case character, one lower case character, atleast one number, must be 6 characters or long 
            const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$');
            const valid = regex.test(control.value);
            return valid ? null : { invalidPassword: true };
        };
    }
}
