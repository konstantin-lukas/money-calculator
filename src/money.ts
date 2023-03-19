export class Money {
    private _isNegative : boolean = false;
    private _integerPart : string = '0';
    private _fractionalPart : string = '0';
    private _floatingPointPrecision : number = 1;
    private static _intRegex : RegExp = /^\d+$/;
    public constructor(initialValue : string) {
        this.value = initialValue;
    }

    /**
     * @param value The value to give the object. Has to be a valid number string.
     * @description Sets the value this money object represents.
     */
    set value(value : string) {
        if (/^-[0]+(?:\.0+)?$/.test(value)) value = value.substring(1);
        const negativeRegex = /^-\d+(?:\.\d+)?$/;
        if (negativeRegex.test(value)) {
            value = value.substring(1);
            this._isNegative = true;
        } else {
            this._isNegative = false;
        }

        const floatRegex = /^\d+\.\d+$/;
        if (floatRegex.test(value)) {
            const parts = value.split(".");
            this._integerPart = parts[0];
            this._fractionalPart = parts[1];
            this._floatingPointPrecision = parts[1].length;
        } else if (Money._intRegex.test(value)) {
            this._integerPart = value;
            this._fractionalPart = '';
            this._floatingPointPrecision = 0;
        } else {
            throw new Error('Value does not match valid pattern.');
        }
    }

    /**
     * @description Returns the currently held value as a dot separated number string. To get proper formatting use the
     * MoneyFormatter class.
     */
    get value() : string {
        let returnValue : string = (this.isNegative ? '-' : '') + this._integerPart;
        if (this._floatingPointPrecision !== 0) returnValue += '.' + this._fractionalPart;
        return returnValue;
    }
    /**
     * @description Returns the currently held integer part of the number, e.g. '25' for the number '-25.20'.
     */
    get integerPart() : string {
        return this._integerPart;
    }
    /**
     * @description Returns the currently held fractional part of the number, e.g. '20' for the number '-25.20'.
     */
    get fractionalPart() : string {
        return this._fractionalPart;
    }
    /**
     * @param integerPart Has to be a valid integer string.
     * @description Sets the currently held integer part of the number, e.g. '25' for the number '-25.20'.
     */
    set integerPart(integerPart : string) {
        if (!Money._intRegex.test(integerPart)) throw new Error('Input number is not a valid positive integer.');
        this._integerPart = integerPart.toString();
        if (this.isNull()) this.isNegative = false;
    }
    /**
     * @param fractionalPart Has to be a valid integer string.
     * @description Sets the currently held fractional part of the number, e.g. '20' for the number '-25.20'.
     */
    set fractionalPart(fractionalPart : string) {
        if (!Money._intRegex.test(fractionalPart)) throw new Error('Input number is not a valid positive integer to represent floating point numbers.');
        this._fractionalPart = fractionalPart.toString();
        this._floatingPointPrecision = fractionalPart.length;
        if (this.isNull()) this._isNegative = false;
    }
    /**
     * @description Returns the amount of fractional places the value holds, e.g. 2 for '1.00'.
     */
    get floatingPointPrecision() : number {
        return this._floatingPointPrecision;
    }
    /**
     * @description Returns true if value is negative, false otherwise. 0 is always non-_isNegative, even if you set it to '-0'.
     */
    get isNegative() : boolean {
        return this._isNegative;
    }
    /**
     * @param sign true = negative, false = positive
     * @description Change the sign of the value to be positive or _isNegative.
     */
    set isNegative(sign : boolean) {
        if (this.isNull()) return;
        this._isNegative = sign;
    }
    /**
     * @description Returns true iff the value held is equal to 0, i.e. 0.00 or 0.000 etc.
     */
    public isNull() : boolean {
        return /^[0]+$/.test(this._integerPart) && /^[0]*$/.test(this._fractionalPart);
    }
}
