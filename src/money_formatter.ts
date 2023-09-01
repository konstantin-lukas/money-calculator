import {Money} from "./money";

export enum DisplayOrder {
    SIGN_SYMBOL_NAME_NUMBER,
    SIGN_NAME_SYMBOL_NUMBER,
    SIGN_SYMBOL_NUMBER_NAME,
    SIGN_NAME_NUMBER_SYMBOL,
    SIGN_NUMBER_SYMBOL_NAME,
    SIGN_NUMBER_NAME_SYMBOL,
    SYMBOL_SIGN_NAME_NUMBER,
    SYMBOL_NAME_SIGN_NUMBER,
    SYMBOL_SIGN_NUMBER_NAME,
    SYMBOL_NAME_NUMBER_SIGN,
    SYMBOL_NUMBER_SIGN_NAME,
    SYMBOL_NUMBER_NAME_SIGN,
    NAME_SIGN_SYMBOL_NUMBER,
    NAME_SYMBOL_SIGN_NUMBER,
    NAME_SIGN_NUMBER_SYMBOL,
    NAME_SYMBOL_NUMBER_SIGN,
    NAME_NUMBER_SIGN_SYMBOL,
    NAME_NUMBER_SYMBOL_SIGN,
    NUMBER_NAME_SYMBOL_SIGN,
    NUMBER_NAME_SIGN_SYMBOL,
    NUMBER_SIGN_NAME_SYMBOL,
    NUMBER_SIGN_SYMBOL_NAME,
    NUMBER_SYMBOL_NAME_SIGN,
    NUMBER_SYMBOL_SIGN_NAME
}


export enum MyriadMode {
    JAPANESE,
    CHINESE
}

export type FormatterInitializer = {
    currencySymbol? : string,
    symbolSeparator? : string,
    currencyName? : string,
    nameSeparator? : string,
    positiveSign? : string,
    negativeSign? : string,
    signSeparator? : string
    displayOrder? : DisplayOrder,
    digitCharacters? : string[],
    myriadMode? : MyriadMode,
    myriadCharacters? : string[],
    decimalSeparator? : string,
    groupSeparator? : string,
    groupSize? : number,
}

export class MoneyFormatter {
    private _currencySymbol : string = '$';
    private _symbolSeparator : string = '';

    private _currencyName : string = '';
    private _nameSeparator : string = ' ';

    private _positiveSign : string = '';
    private _negativeSign : string = '-';
    private _signSeparator : string = '';

    private _displayOrder : DisplayOrder = DisplayOrder.SIGN_SYMBOL_NUMBER_NAME;

    private _digitCharacters : string[] = ['0','1','2','3','4','5','6','7','8','9'];
    private _myriadMode : MyriadMode = MyriadMode.JAPANESE;
    private _myriadCharacters : string[] = [
        '十', // 10
        '百', // 100
        '千', // 1,000
        '万', // 10,000 : STARTING AFTER THIS ONE, EACH SYMBOL IS 10,000 TIMES THE PREVIOUS ONE
        '億', // 10^8
        '兆', // 10^12
        '京', // 10^16
        '垓', // 10^20
        '𥝱',// 10^24
        '穣', // 10^28
        '溝', // 10^32
        '澗', // 10^36
        '正', // 10^40
        '載', // 10^44
    ];
    private _decimalSeparator : string = '.';
    private _groupSeparator : string = ',';
    private _groupSize : number = 3;

    public constructor(initializer : FormatterInitializer) {

        if (typeof initializer.currencySymbol === 'string')
            this.currencySymbol = initializer.currencySymbol;
        if (typeof initializer.symbolSeparator === 'string')
            this.symbolSeparator = initializer.symbolSeparator;
        if (typeof initializer.currencyName === 'string')
            this.currencyName = initializer.currencyName;
        if (typeof initializer.nameSeparator === 'string')
            this.nameSeparator = initializer.nameSeparator;
        if (typeof initializer.positiveSign === 'string')
            this.positiveSign = initializer.positiveSign;
        if (typeof initializer.negativeSign === 'string')
            this.negativeSign = initializer.negativeSign;
        if (typeof initializer.signSeparator === 'string')
            this.signSeparator = initializer.signSeparator;
        if (typeof initializer.displayOrder !== 'undefined' && typeof initializer.displayOrder === typeof DisplayOrder.SIGN_NUMBER_SYMBOL_NAME)
            this.displayOrder = initializer.displayOrder;
        if (typeof initializer.myriadMode !== 'undefined' && typeof initializer.myriadMode === typeof MyriadMode.JAPANESE)
            this.myriadMode = initializer.myriadMode;
        if (typeof initializer.digitCharacters === 'object')
            this.digitCharacters = initializer.digitCharacters;
        if (typeof initializer.myriadCharacters === 'object')
            this.myriadCharacters = initializer.myriadCharacters;
        if (typeof initializer.groupSeparator === 'string')
            this.groupSeparator = initializer.groupSeparator;
        if (typeof initializer.decimalSeparator === 'string')
            this.decimalSeparator = initializer.decimalSeparator;
        if (typeof initializer.groupSize === 'number')
            this.groupSize = initializer.groupSize;
    }

    /**
     *
     * @param moneyString The string to convert to a myriad string.
     * @private
     * @description Converts the string to the Japanese myriad format. In this format 千 is only preceded by 一 if it serves
     * as a multiplier, e.g. 一千万 but 千百. 万 is always preceded by 一, i.e. 一万. The numbers 0-9 are the ones assigned
     * with the setMyriadCharacters(). By default it will return 1万, so you need to set those characters manually if
     * you want pure Kanji.
     */
    private handleJapaneseMyriad(moneyString : string) : string {
        let digit : number = 0;
        let result : string = '';
        let nextThreeDigitsContainNonZeroDigit : boolean = false;
        for (let i = 0; i < moneyString.length; i++) {
            digit = parseInt(moneyString.charAt(i));
            nextThreeDigitsContainNonZeroDigit = moneyString.length > i + 1 && moneyString.charAt(i + 1) !== '0' ||
                moneyString.length > i + 2 && moneyString.charAt(i + 2) !== '0' ||
                moneyString.length > i + 3 && moneyString.charAt(i + 3) !== '0';
            switch (i) {
                case 0: // 0 - 9
                    if (digit !== 0)
                        result = this._digitCharacters[digit] + result;
                    break;
                case 1: // 10
                case 2: // 100
                case 3: // 1000
                    if (digit !== 0) {
                        if (digit === 1)
                            result = this._myriadCharacters[i - 1] + result;
                        else
                            result = this._digitCharacters[digit] + this._myriadCharacters[i - 1] + result;
                    }
                    break;
                case 4: // 10000
                    if (digit !== 0)
                        result = this._digitCharacters[digit] + this._myriadCharacters[i - 1] + result;
                    else if (nextThreeDigitsContainNonZeroDigit)
                        result = this._myriadCharacters[Math.trunc(i / 4) + 2] + result;
                    break;
                default:
                    if (i % 4 === 0) {
                        if (digit !== 0)
                            result = this._digitCharacters[digit] + this._myriadCharacters[Math.trunc(i / 4) + 2] + result;
                        else if (nextThreeDigitsContainNonZeroDigit)
                            result = this._myriadCharacters[Math.trunc(i / 4) + 2] + result;
                    } else if (i % 4 === 1 && digit !== 0) {
                        if (digit === 1)
                            result = this._myriadCharacters[0] + result;
                        else
                            result = this._digitCharacters[digit] + this._myriadCharacters[0] + result;
                    } else if (i % 4 === 2 && digit !== 0) {
                        if (digit === 1)
                            result = this._myriadCharacters[1] + result;
                        else
                            result = this._digitCharacters[digit] + this._myriadCharacters[1] + result;
                    } else if (i % 4 === 3 && digit !== 0) {
                        result = this._digitCharacters[digit] + this._myriadCharacters[2] + result;
                    }
                    break;
            }

        }
        return result;
    }

    /**
     *
     * @param string The string in which to replace characters.
     * @private
     * @brief Replaces all digits in a string with the characters assigned in the formatter.
     */
    private replaceDigits(string : string) : string {
        string = string.replace(/[0]/g, this._digitCharacters[0]);
        string = string.replace(/[1]/g, this._digitCharacters[1]);
        string = string.replace(/[2]/g, this._digitCharacters[2]);
        string = string.replace(/[3]/g, this._digitCharacters[3]);
        string = string.replace(/[4]/g, this._digitCharacters[4]);
        string = string.replace(/[5]/g, this._digitCharacters[5]);
        string = string.replace(/[6]/g, this._digitCharacters[6]);
        string = string.replace(/[7]/g, this._digitCharacters[7]);
        string = string.replace(/[8]/g, this._digitCharacters[8]);
        string = string.replace(/[9]/g, this._digitCharacters[9]);
        return string;
    }

    /**
     *
     * @param isNegative Whether the value of the number is negative
     * @private
     * @returns String to display before number.
     */
    public prefix(isNegative : boolean) : string {
        let result : string = '';
        const sign : string = isNegative ? this._negativeSign : this._positiveSign;

        switch (this._displayOrder) {
            case DisplayOrder.NAME_NUMBER_SIGN_SYMBOL:
            case DisplayOrder.NAME_NUMBER_SYMBOL_SIGN:
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                break;
            case DisplayOrder.NAME_SIGN_NUMBER_SYMBOL:
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                break;
            case DisplayOrder.NAME_SIGN_SYMBOL_NUMBER:
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                break;
            case DisplayOrder.NAME_SYMBOL_NUMBER_SIGN:
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                break;
            case DisplayOrder.NAME_SYMBOL_SIGN_NUMBER:
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                break;
            case DisplayOrder.SIGN_NAME_NUMBER_SYMBOL:
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                break;
            case DisplayOrder.SIGN_NAME_SYMBOL_NUMBER:
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                break;
            case DisplayOrder.SIGN_NUMBER_NAME_SYMBOL:
            case DisplayOrder.SIGN_NUMBER_SYMBOL_NAME:
                if (sign !== '') result += sign + this._signSeparator;
                break;
            case DisplayOrder.SIGN_SYMBOL_NAME_NUMBER:
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                break;
            case DisplayOrder.SIGN_SYMBOL_NUMBER_NAME:
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                break;
            case DisplayOrder.SYMBOL_NAME_NUMBER_SIGN:
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                break;
            case DisplayOrder.SYMBOL_NAME_SIGN_NUMBER:
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                break;
            case DisplayOrder.SYMBOL_NUMBER_NAME_SIGN:
            case DisplayOrder.SYMBOL_NUMBER_SIGN_NAME:
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                break;
            case DisplayOrder.SYMBOL_SIGN_NAME_NUMBER:
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                if (this._currencyName !== '') result += this._currencyName + this._nameSeparator;
                break;
            case DisplayOrder.SYMBOL_SIGN_NUMBER_NAME:
                if (this._currencySymbol !== '') result += this._currencySymbol + this._symbolSeparator;
                if (sign !== '') result += sign + this._signSeparator;
                break;

        }
        return result;
    }

    /**
     *
     * @param isNegative Whether the value of the number is negative
     * @private
     * @returns String to display before number.
     */
    suffix(isNegative : boolean) : string {
        let result : string = '';
        const sign : string = isNegative ? this._negativeSign : this._positiveSign;
        switch (this._displayOrder) {
            case DisplayOrder.NAME_NUMBER_SIGN_SYMBOL:
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.NAME_NUMBER_SYMBOL_SIGN:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.NAME_SIGN_NUMBER_SYMBOL:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.NAME_SYMBOL_NUMBER_SIGN:
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.NUMBER_NAME_SIGN_SYMBOL:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.NUMBER_NAME_SYMBOL_SIGN:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.NUMBER_SIGN_NAME_SYMBOL:
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.NUMBER_SIGN_SYMBOL_NAME:
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;
            case DisplayOrder.NUMBER_SYMBOL_NAME_SIGN:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.NUMBER_SYMBOL_SIGN_NAME:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;
            case DisplayOrder.SIGN_NAME_NUMBER_SYMBOL:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.SIGN_NUMBER_NAME_SYMBOL:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                break;
            case DisplayOrder.SIGN_NUMBER_SYMBOL_NAME:
                if (this._currencySymbol !== '') result += this._symbolSeparator + this._currencySymbol;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;
            case DisplayOrder.SIGN_SYMBOL_NUMBER_NAME:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;
            case DisplayOrder.SYMBOL_NAME_NUMBER_SIGN:
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.SYMBOL_NUMBER_NAME_SIGN:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                if (sign !== '') result += this._signSeparator + sign;
                break;
            case DisplayOrder.SYMBOL_NUMBER_SIGN_NAME:
                if (sign !== '') result += this._signSeparator + sign;
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;
            case DisplayOrder.SYMBOL_SIGN_NUMBER_NAME:
                if (this._currencyName !== '') result += this._nameSeparator + this._currencyName;
                break;

        }

        return result;
    }
    /**
     * @param money The value to convert to a myriad string.
     * @description Formats the value to a myriad format string like in many east Asian languages. Use setMyriadMode() method
     * to change behaviour.
     */
    public formatMyriad(money : Money) : string {
        if (money.floatingPointPrecision !== 0)
            throw new Error('Only values without decimals are supported for conversion to myriad system.');
        let moneyString : string = money.integerPart;

        if (this._myriadCharacters.length <= 4 && moneyString.length !== 1 && this._myriadCharacters.length < moneyString.length - 1
            || this._myriadCharacters.length > 4 && this._myriadCharacters.length < 3 + Math.trunc((moneyString.length - 1) / 4))
            throw new Error('Not enough characters defined to print myriad string. Use setMyriadCharacters to define more characters.');

        let result : string = this.prefix(money.isNegative);

        if (moneyString.length === 1) {
            result += this._digitCharacters[parseInt(moneyString)];
        } else {
            moneyString = moneyString.split("").reverse().join("");
            if (this._myriadMode === MyriadMode.JAPANESE) {
                result += this.handleJapaneseMyriad(moneyString);
            } else {
                throw new Error('Provided myriad mode not supported.');
            }

        }

        result += this.suffix(money.isNegative);

        return result;

    }
    /**
     * @param money The value to format.
     * @brief Formats the value depending on the current state of the formatter.
     */
    public format(money : Money) {
        let result : string = this.prefix(money.isNegative);

        let integerPart : string = this.replaceDigits(money.integerPart);
        if (this._groupSize > 0 && integerPart.length > this._groupSize && this._groupSeparator !== '') {
            let index : number = 0;
            for (let i = Math.trunc((integerPart.length - 1) / this._groupSize); i > 0; i--) {
                index = integerPart.length - this._groupSize * i;
                integerPart = integerPart.slice(0, index) + this._groupSeparator + integerPart.slice(index);
            }
        }
        result += integerPart;
        if (money.floatingPointPrecision > 0) {
            result += this._decimalSeparator;
            result += this.replaceDigits(money.fractionalPart);
        }

        result += this.suffix(money.isNegative);

        return result;
    }
    /**
     * @param digits An array of characters of length 10.
     * @description Allows to set the symbols to be used for the digits 0-9. You can use any string to replace any digit.
     * If you pass ['NULL','1','2','3','4','5','6','7','8','9'] as the parameter for instance, 105$ will be printed as
     * 1NULL5$.
     */
    set digitCharacters(digits : string[]) {
        if (digits.length !== 10)
            throw new Error('10 digits need to passed as a string array.');
        for (let i = 0; i < digits.length; i++) {
            this._digitCharacters[i] = digits[i];
        }
    }
    /**
     * @param characters The characters required to format to a myriad string as a string array.
     * @description The amount of characters you pass inside the array determines the largest value you can format to a
     * myriad string. The following shows the the meaning of the character for each index of the array:
     * [0]=10,[1]=100,[2]=1000,[3]=10^4^,[4]=10^8^,[5]=10^12^, ... This means that if you pass in an array of length 1 you
     * can only format values up to 99 (e.g. 九十九 in Japanese).
     */
    set myriadCharacters(characters : string[]) {
        this._myriadCharacters = characters.slice(0);
    }
    /**
     * @param separator The characters that separate the numbers from the currency symbol.
     * @brief Set the characters that separate the numbers from the currency symbol. Defaults to a simple space.
     */
    set symbolSeparator(separator : string) {
        this._symbolSeparator = separator;
    }
    /**
     * @param myriadMode Sets the active myriad mode.
     * @description This sets the myriad mode, that controls the behaviour of the getFormattedMyriadString method.
     */
    set myriadMode(myriadMode : MyriadMode) {
        this._myriadMode = myriadMode;
    }
    /**
     * @param symbol The currency symbol to use.
     * @description This sets the symbol representing the currency, e.g. '$'. The string doesn't have to a single character.
     * You could also pass 'dollar'.
     */
    set currencySymbol(symbol : string) {
        this._currencySymbol = symbol;
    }
    /**
     * @param symbol The symbol to display in front of positive numbers.
     * @description This sets the symbol to display in front of positive numbers. By default this is an empty string.
     */
    set positiveSign(symbol : string) {
        this._positiveSign = symbol;
    }
    /**
     * @param symbol The symbol to display in front of negative numbers.
     * @description This sets the symbol to display in front of negative numbers. By default this is '-'.
     */
    set negativeSign(symbol : string) {
        this._negativeSign = symbol;
    }
    /**
     * @param symbol The symbol to put between the integer part and the fractional number part.
     * @description This sets the symbol to put between the integer part and the fractional number part. Default is '.'.
     */
    set decimalSeparator(symbol : string) {
        this._decimalSeparator = symbol;
    }
    /**
     * @param size The amount of integer places to be grouped together.
     * @description Often larger numbers get grouped into smaller sections, like 1,000,000 instead of 1000000. This sets
     * the amount of characters that get grouped together. Default is 3.
     */
    set groupSize(size : number) {
        if (!Number.isInteger(size) || size < 0)
            throw new Error('Size should be a positive integer.');
        this._groupSize = size;
    }
    /**
     * @param symbol The character to group digits.
     * @description Often larger numbers get grouped into smaller sections, like 1,000,000 instead of 1000000. This sets
     * the the character used for that. Default is ','.
     */
    set groupSeparator(symbol : string) {
        this._groupSeparator = symbol;
    }
    /**
     * @param order The way to display formatted strings.
     * @description Sets the order in which display currency name, currency sign, pos/neg sign and number. If you want to
     * omit any of these, set the corresponding member to an empty string. Note: number is always displayed.
     */
    set displayOrder(order : DisplayOrder) {
        this._displayOrder = order;
    }

    /**
     * @param symbol The symbol to display between the sign (pos/neg) and the number or currency symbol depending on display mode.
     * Default is an empty string.
     */
    set signSeparator(symbol : string) {
        this._signSeparator = symbol;
    }

    set currencyName(name : string) {
        this._currencyName = name;
    }

    set nameSeparator(name : string) {
        this._nameSeparator = name;
    }

    get currencySymbol() : string {
        return this._currencySymbol;
    }

    get symbolSeparator() : string {
        return this._symbolSeparator;
    }

    get positiveSign() : string {
        return this._positiveSign;
    }

    get negativeSign() : string {
        return this._negativeSign;
    }

    get digitCharacters() : string[] {
        return this._digitCharacters.slice(0);
    }

    get myriadMode() : MyriadMode {
        return this._myriadMode;
    }

    get myriadCharacters() : string[] {
        return this._myriadCharacters.slice(0);
    }

    get decimalSeparator() : string {
        return this._decimalSeparator;
    }

    get groupSeparator() : string {
        return this._groupSeparator;
    }

    get groupSize() : number {
        return this._groupSize;
    }

    get displayOrder() : DisplayOrder {
        return this._displayOrder;
    }

    get signSeparator() : string {
        return this._signSeparator;
    }

    get currencyName() : string {
        return this._currencyName;
    }

    get nameSeparator() : string {
        return this._nameSeparator;
    }
}
