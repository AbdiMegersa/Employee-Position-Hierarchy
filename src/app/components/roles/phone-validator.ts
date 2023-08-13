import { ValidatorFn, AbstractControl} from '@angular/forms'

export function phoneValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberRegex = /^\+251\d{9}$/;
      const valid = phoneNumberRegex.test(control.value);
      return valid ? null : { invalidPhoneNumber: true };
    };
  }