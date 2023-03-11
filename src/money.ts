export class Money {
    private negative : boolean = false;
    private integerPart : string = '0';
    private fractionalPart : string = '0';
    private floatingPointPrecision : number = 1;
    private static intRegex : RegExp = /^\d+$/;
    public constructor(initialValue : string) {
        this.setValue(initialValue);
    }

    public setValue(value : string) {
        if (/^-[0]+(?:\.0+)?$/.test(value)) value = value.substring(1);
        const negativeRegex = /^-\d+(?:\.\d+)?$/;
        if (negativeRegex.test(value)) {
            value = value.substring(1);
            this.negative = true;
        } else {
            this.negative = false;
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
        if (this.isNull()) this.negative = false;
    }

    public setFractionalPart(fractionalPart : string) : void {
        if (!Money.intRegex.test(fractionalPart)) throw new Error('Input number is not a valid positive integer to represent floating point numbers.');
        this.fractionalPart = fractionalPart.toString();
        this.floatingPointPrecision = fractionalPart.length;
        if (this.isNull()) this.negative = false;
    }

    public getFloatingPointPrecision() : number {
        return this.floatingPointPrecision;
    }

    public getSign() : string {
        return this.negative ? '-' : '';
    }

    public isNegative() : boolean {
        return this.negative;
    }

    public setSign(sign : boolean) : void {
        if (this.isNull()) return;
        this.negative = sign;
    }

    public isNull() : boolean {
        return /^[0]+$/.test(this.integerPart) && /^[0]*$/.test(this.fractionalPart);
    }
}
