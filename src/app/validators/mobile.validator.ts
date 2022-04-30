import { AbstractControl } from '@angular/forms';

export function ValidateMobile(control: AbstractControl) {
    let mobileValue = fixNumber(control.value);
    if (
        control.value !== null &&
        mobileValue?.length != 10 &&
        isNumeric(mobileValue)
    ) {
        return { validMobile: true };
    }
    return null;
}

const isNumeric = (num) => {
    return !isNaN(num);
};

const fixNumber = (number) => {
    let numberSplit: any;
    const mobileNumber = `${number}`;
    numberSplit = mobileNumber.split('');
    if (numberSplit[0] == '0') {
        numberSplit.shift();
        numberSplit = numberSplit.join('');
        return numberSplit;
    } else {
        return number;
    }
};
