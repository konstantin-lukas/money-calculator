import {Money} from "./money";

export enum position {
    FRONT,
    BACK
}

export enum myriadMode {
    JAPANESE,
    CHINESE
}

export class MoneyFormatter {
    private currencySymbol : string = '$';
    private symbolPosition : position = position.FRONT;
    private symbolSeparator : string = ' ';
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
            } else if (this.myriadMode === myriadMode.CHINESE) {

            }

        }



        result += money.getSign();



        if (this.symbolPosition === position.BACK)
            result += this.symbolSeparator + this.currencySymbol;
        else if (this.symbolPosition === position.FRONT)
            result = this.currencySymbol + this.symbolSeparator + result;
        return result;

    }
    public getFormattedString(money : Money) {
        let result : string =
            (this.symbolPosition === position.FRONT)
                ? (this.currencySymbol + this.symbolSeparator)
                : '';

        result += money.getSign();
        let integerPart : string = this.replaceDigits(money.getIntegerPart());
        if (integerPart.length > this.groupSize && this.groupSeparator !== '') {
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

        if (this.symbolPosition === position.BACK)
            result += this.symbolSeparator + this.currencySymbol;



        return result;
    }
    public setDigitCharacters(digits : string[]) : void {
        if (digits.length !== 10)
            throw new Error('10 digits need to passed as a string array.');
        for (let i = 0; i < digits.length; i++) {
            this.digitCharacters[i] = digits[i];
        }
    }
    // THE NUMBER OF CHARACTERS DETERMINES THE HIGHEST POSSIBLE VALUE
    public setMyriadCharacters(characters : string[]) {
        this.myriadCharacters = characters;
    }
    public setSymbolPosition(position : position) {
        this.symbolPosition = position;
    }
    public setSymbolSeparator(separator : string) {
        this.symbolSeparator = separator;
    }
}
