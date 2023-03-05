export class Money {
    private isNegative : boolean = false;
    private integerPart : string = '0';
    private fractionalPart : string = '0';
    private floatingPointPrecision : number = 1;
    private static intRegex = /^\d+$/;
    public constructor(initialValue : string) {
        this.setValue(initialValue);
    }

    public setValue(value : string) {
        if (value === '-0') value = '0';
        const negativeRegex = /^-\d+(?:\.\d+)?$/;
        if (negativeRegex.test(value)) {
            value = value.substring(1);
            this.isNegative = true;
        } else {
            this.isNegative = false;
        }

        const floatRegex = /^\d+\.\d+$/;
        if (floatRegex.test(value)) {
            const parts = value.split(".");
            this.integerPart = parts[0];
            this.fractionalPart = parts[1];
            this.floatingPointPrecision = parts[1].length;
        } else if (Money.intRegex.test(value)) {
            this.integerPart = value;
            this.fractionalPart = '';
            this.floatingPointPrecision = 0;
        } else {
            throw new Error('Value does not match valid pattern.');
        }
    }

    public getValue() : string {
        let returnValue : string = this.getSign() + this.integerPart;
        if (this.floatingPointPrecision !== 0) returnValue += '.' + this.fractionalPart;
        return returnValue;
    }

    public getIntegerPart() : string {
        return this.integerPart;
    }

    public getFractionalPart() : string {
        return this.fractionalPart;
    }

    public setIntegerPart(integerPart : string) : void {
        if (!Money.intRegex.test(integerPart)) throw new Error('Input number is not a valid positive integer.');
        this.integerPart = integerPart.toString();
    }

    public setFractionalPart(fractionalPart : string) : void {
        if (!Money.intRegex.test(fractionalPart)) throw new Error('Input number is not a valid positive integer to represent floating point numbers.');
        this.fractionalPart = fractionalPart.toString();
        this.floatingPointPrecision = fractionalPart.length;
    }

    public getFloatingPointPrecision() : number {
        return this.floatingPointPrecision;
    }

    public getSign() : string {
        return this.isNegative ? '-' : '';
    }
}
