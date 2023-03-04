export class Money {
    private isNegative : boolean = false;
    private integerPart : string = '0';
    private fractionalPart : string = '0';
    private fractionalDigitCount : number = 1;
    public constructor(initialValue : number) {
        this.setValue(initialValue);
    }

    public setValue(value : number) {
        if (isNaN(value)) throw new Error('Value is not a number.');
        let stringValue = value.toString();
        if (stringValue === '-0') stringValue = '0';
        const negativeRegex = /^-\d+(?:\.\d+)?$/;
        if (negativeRegex.test(stringValue)) {
            stringValue = stringValue.substring(1);
            this.isNegative = true;
        }

        const floatRegex = /^\d+\.\d+$/;
        const intRegex = /^\d+$/;
        if (floatRegex.test(stringValue)) {
            const parts = stringValue.split(".");
            this.integerPart = parts[0];
            this.fractionalPart = parts[1];
            this.fractionalDigitCount = parts[1].length;
        } else if (intRegex.test(stringValue)) {
            this.integerPart = stringValue;
            this.fractionalDigitCount = 0;
        } else {
            throw new Error('Value does not match valid pattern.');
        }
    }

    public getValue() : string {
        if (this.fractionalDigitCount === 0 ) {
            return (this.isNegative ? '-' : '') + this.integerPart;
        } else {
            return (this.isNegative ? '-' : '') + this.integerPart + '.' + this.fractionalPart;
        }
    }

    public getIntegerPart() : string {
        return this.integerPart;
    }

    public getFractionalPart() : string {
        return this.fractionalPart;
    }

    public setIntegerPart(integerPart : number) : void {
        if (!Number.isInteger(integerPart)) return;
        this.integerPart = integerPart.toString();
    }
}
