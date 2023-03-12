export class Money {
    private negative : boolean = false;
    private integerPart : string = '0';
    private fractionalPart : string = '0';
    private floatingPointPrecision : number = 1;
    private static intRegex : RegExp = /^\d+$/;
    public constructor(initialValue : string) {
        this.setValue(initialValue);
    }

    /**
     * @param value The value to give the object. Has to be a valid number string.
     * @description Sets the value this money object represents.
     */
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

    /**
     * @description Returns the currently held value as a dot separated number string. To get proper formatting use the
     * MoneyFormatter class.
     */
    public getValue() : string {
        let returnValue : string = (this.isNegative() ? '-' : '') + this.integerPart;
        if (this.floatingPointPrecision !== 0) returnValue += '.' + this.fractionalPart;
        return returnValue;
    }
    /**
     * @description Returns the currently held integer part of the number, e.g. '25' for the number '-25.20'.
     */
    public getIntegerPart() : string {
        return this.integerPart;
    }
    /**
     * @description Returns the currently held fractional part of the number, e.g. '20' for the number '-25.20'.
     */
    public getFractionalPart() : string {
        return this.fractionalPart;
    }
    /**
     * @param integerPart Has to be a valid integer string.
     * @description Sets the currently held integer part of the number, e.g. '25' for the number '-25.20'.
     */
    public setIntegerPart(integerPart : string) : void {
        if (!Money.intRegex.test(integerPart)) throw new Error('Input number is not a valid positive integer.');
        this.integerPart = integerPart.toString();
        if (this.isNull()) this.negative = false;
    }
    /**
     * @param fractionalPart Has to be a valid integer string.
     * @description Sets the currently held fractional part of the number, e.g. '20' for the number '-25.20'.
     */
    public setFractionalPart(fractionalPart : string) : void {
        if (!Money.intRegex.test(fractionalPart)) throw new Error('Input number is not a valid positive integer to represent floating point numbers.');
        this.fractionalPart = fractionalPart.toString();
        this.floatingPointPrecision = fractionalPart.length;
        if (this.isNull()) this.negative = false;
    }
    /**
     * @description Returns the amount of fractional places the value holds, e.g. 2 for '1.00'.
     */
    public getFloatingPointPrecision() : number {
        return this.floatingPointPrecision;
    }
    /**
     * @description Returns true if value is negative, false otherwise. 0 is always non-negative, even if you set it to '-0'.
     */
    public isNegative() : boolean {
        return this.negative;
    }
    /**
     * @param sign true = negative, false = positive
     * @description Change the sign of the value to be positive or negative.
     */
    public makeNegative(sign : boolean) : void {
        if (this.isNull()) return;
        this.negative = sign;
    }
    /**
     * @description Returns true if the value held is equal to 0, i.e. 0.00 or 0.000 etc.
     */
    public isNull() : boolean {
        return /^[0]+$/.test(this.integerPart) && /^[0]*$/.test(this.fractionalPart);
    }
}
