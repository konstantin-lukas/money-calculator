import {Money} from "./money";

export enum symbolPosition {
    FRONT,
    BACK
}

export enum myriadMode {
    JAPANESE,
    CHINESE
}

export enum negativeDisplayMode {
    BEFORE,
    AFTER,
    BETWEEN,
    PARENTHESES
}

export class MoneyFormatter {
    private currencySymbol : string = '$';
    private symbolPosition : symbolPosition = symbolPosition.FRONT;
    private symbolSeparator : string = ' ';
    private posSign : string = '';
    private negSign : string = '-';
    private digitCharacters : string[] = ['0','1','2','3','4','5','6','7','8','9'];
    private myriadMode : myriadMode = myriadMode.JAPANESE;
    private myriadCharacters : string[] = [
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
    private decimalSeparator : string = '.';
    private groupSeparator : string = ',';
    private groupSize : number = 3;
    private negativeDisplayMode : negativeDisplayMode = negativeDisplayMode.BEFORE;

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
                        result = this.digitCharacters[digit] + result;
                    break;
                case 1: // 10
                case 2: // 100
                case 3: // 1000
                    if (digit !== 0) {
                        if (digit === 1)
                            result = this.myriadCharacters[i - 1] + result;
                        else
                            result = this.digitCharacters[digit] + this.myriadCharacters[i - 1] + result;
                    }
                    break;
                case 4: // 10000
                    if (digit !== 0)
                        result = this.digitCharacters[digit] + this.myriadCharacters[i - 1] + result;
                    else if (nextThreeDigitsContainNonZeroDigit)
                        result = this.myriadCharacters[Math.trunc(i / 4) + 2] + result;
                    break;
                default:
                    if (i % 4 === 0) {
                        if (digit !== 0)
                            result = this.digitCharacters[digit] + this.myriadCharacters[Math.trunc(i / 4) + 2] + result;
                        else if (nextThreeDigitsContainNonZeroDigit)
                            result = this.myriadCharacters[Math.trunc(i / 4) + 2] + result;
                    } else if (i % 4 === 1 && digit !== 0) {
                        if (digit === 1)
                            result = this.myriadCharacters[0] + result;
                        else
                            result = this.digitCharacters[digit] + this.myriadCharacters[0] + result;
                    } else if (i % 4 === 2 && digit !== 0) {
                        if (digit === 1)
                            result = this.myriadCharacters[1] + result;
                        else
                            result = this.digitCharacters[digit] + this.myriadCharacters[1] + result;
                    } else if (i % 4 === 3 && digit !== 0) {
                        result = this.digitCharacters[digit] + this.myriadCharacters[2] + result;
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
        string = string.replace(/[0]/g, this.digitCharacters[0]);
        string = string.replace(/[1]/g, this.digitCharacters[1]);
        string = string.replace(/[2]/g, this.digitCharacters[2]);
        string = string.replace(/[3]/g, this.digitCharacters[3]);
        string = string.replace(/[4]/g, this.digitCharacters[4]);
        string = string.replace(/[5]/g, this.digitCharacters[5]);
        string = string.replace(/[6]/g, this.digitCharacters[6]);
        string = string.replace(/[7]/g, this.digitCharacters[7]);
        string = string.replace(/[8]/g, this.digitCharacters[8]);
        string = string.replace(/[9]/g, this.digitCharacters[9]);
        return string;
    }
    /**
     * @param money The value to convert to a myriad string.
     * @description Formats the value to a myriad format string like in many east Asian languages. Use setMyriadMode() method
     * to change behaviour.
     */
    public getFormattedMyriadString(money : Money) : string {
        if (money.getFloatingPointPrecision() !== 0)
            throw new Error('Only values without decimals are supported for conversion to myriad system.');
        let moneyString : string = money.getIntegerPart();

        if (this.myriadCharacters.length <= 4 && moneyString.length !== 1 && this.myriadCharacters.length < moneyString.length - 1
            || this.myriadCharacters.length > 4 && this.myriadCharacters.length < 3 + Math.trunc((moneyString.length - 1) / 4))
            throw new Error('Not enough characters defined to print myriad string. Use setMyriadCharacters to define more characters.');

        let result : string = '';

        if (moneyString.length === 1) {
            result = this.digitCharacters[parseInt(moneyString)];
        } else {
            moneyString = moneyString.split("").reverse().join("");
            if (this.myriadMode === myriadMode.JAPANESE) {
                result = this.handleJapaneseMyriad(moneyString);
            } else {
                throw new Error('Provided myriad mode not supported.');
            }

        }



        result = (money.isNegative() ? this.negSign : this.posSign) + result;



        if (this.symbolPosition === symbolPosition.BACK)
            result += this.symbolSeparator + this.currencySymbol;
        else if (this.symbolPosition === symbolPosition.FRONT)
            result = this.currencySymbol + this.symbolSeparator + result;
        return result;

    }
    /**
     * @param money The value to format.
     * @brief Formats the value depending on the current state of the formatter.
     */
    public getFormattedString(money : Money) {
        let result : string =
            (this.symbolPosition === symbolPosition.FRONT)
                ? (this.currencySymbol + this.symbolSeparator)
                : '';

        result += money.isNegative() ? this.negSign : this.posSign;
        let integerPart : string = this.replaceDigits(money.getIntegerPart());
        if (this.groupSize > 0 && integerPart.length > this.groupSize && this.groupSeparator !== '') {
            let index : number = 0;
            for (let i = Math.trunc((integerPart.length - 1) / this.groupSize); i > 0; i--) {
                index = integerPart.length - this.groupSize * i;
                integerPart = integerPart.slice(0, index) + this.groupSeparator + integerPart.slice(index);
            }
        }
        result += integerPart;
        if (money.getFloatingPointPrecision() > 0) {
            result += this.decimalSeparator;
            result += this.replaceDigits(money.getFractionalPart());
        }

        if (this.symbolPosition === symbolPosition.BACK)
            result += this.symbolSeparator + this.currencySymbol;



        return result;
    }
    /**
     * @param digits An array of characters of length 10.
     * @description Allows to set the symbols to be used for the digits 0-9. You can use any string to replace any digit.
     * If you pass ['NULL','1','2','3','4','5','6','7','8','9'] as the parameter for instance, 105$ will be printed as
     * 1NULL5$.
     */
    public setDigitCharacters(digits : string[]) : void {
        if (digits.length !== 10)
            throw new Error('10 digits need to passed as a string array.');
        for (let i = 0; i < digits.length; i++) {
            this.digitCharacters[i] = digits[i];
        }
    }
    /**
     * @param characters The characters required to format to a myriad string as a string array.
     * @description The amount of characters you pass inside the array determines the largest value you can format to a
     * myriad string. The following shows the the meaning of the character for each index of the array:
     * [0]=10,[1]=100,[2]=1000,[3]=10^4^,[4]=10^8^,[5]=10^12^, ... This means that if you pass in an array of length 1 you
     * can only formats values up to 99 (e.g. 九十九 in Japanese).
     */
    public setMyriadCharacters(characters : string[]) {
        this.myriadCharacters = characters;
    }
    /**
     * @param position The position to put the currency symbol.
     * @brief Set whether to display the symbol in front of or behind the number.
     */
    public setSymbolPosition(position : symbolPosition) {
        this.symbolPosition = position;
    }
    /**
     * @param separator The characters that separate the numbers from the currency symbol.
     * @brief Set the characters that separate the numbers from the currency symbol. Defaults to a simple space.
     */
    public setSymbolSeparator(separator : string) {
        this.symbolSeparator = separator;
    }
    /**
     * @param myriadMode Sets the active myriad mode.
     * @description This sets the myriad mode, that controls the behaviour of the getFormattedMyriadString method.
     */
    public setMyriadMode(myriadMode : myriadMode) {
        this.myriadMode = myriadMode;
    }
    /**
     * @param symbol The currency symbol to use.
     * @description This sets the symbol representing the currency, e.g. '$'. The string doesn't have to a single character.
     * You could also pass 'dollar'.
     */
    public setCurrencySymbol(symbol : string) {
        this.currencySymbol = symbol;
    }
    /**
     * @param symbol The symbol to display in front of positive numbers.
     * @description This sets the symbol to display in front of positive numbers. By default this is an empty string.
     */
    public setPositiveSign(symbol : string) {
        this.posSign = symbol;
    }
    /**
     * @param symbol The symbol to display in front of negative numbers.
     * @description This sets the symbol to display in front of negative numbers. By default this is '-'.
     */
    public setNegativeSign(symbol : string) {
        this.negSign = symbol;
    }
    /**
     * @param symbol The symbol to put between the integer part and the fractional number part.
     * @description This sets the symbol to put between the integer part and the fractional number part. Default is '.'.
     */
    public setDecimalSeparator(symbol : string) {
        this.decimalSeparator = symbol;
    }
    /**
     * @param size The amount of integer places to be grouped together.
     * @description Often larger numbers get grouped into smaller sections, like 1,000,000 instead of 1000000. This sets
     * the amount of characters that get grouped together. Default is 3.
     */
    public setGroupSize(size : number) {
        this.groupSize = size;
    }
    /**
     * @param symbol The character to group digits.
     * @description Often larger numbers get grouped into smaller sections, like 1,000,000 instead of 1000000. This sets
     * the the character used for that. Default is ','.
     */
    public setGroupSeparator(symbol : string) {
        this.groupSeparator = symbol;
    }

}
