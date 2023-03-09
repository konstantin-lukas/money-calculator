import {Money} from "./money";

export enum position {
    FRONT,
    BACK
}

export class MoneyFormatter {
    private currencySymbol : string = '$';
    private symbolPosition : position = position.FRONT;
    private symbolSeparator : string = ' ';
    private digitCharacters : string[] = ['0','1','2','3','4','5','6','7','8','9'];
    // STARTING AT 万 EACH SYMBOL IS 10,000 TIMES THE PREVIOUS ONE
    private myriadCharacters : string[] = [
        '〇', // 0
        '一', // 1
        '二', // 2
        '三', // 3
        '四', // 4
        '五', // 5
        '六', // 6
        '七', // 7
        '八', // 8
        '九', // 9
        '十', // 10
        '百', // 100
        '千', // 1,000
        '万', // 10,000
        '亿', // 10^8
        '兆', // 10^12
        '京', // 10^16
        '垓', // 10^20
        '秭', // 10^24
        '穰', // 10^28
        '沟', // 10^32
        '涧', // 10^36
        '正', // 10^40
        '载' // 10^44
    ];
    private decimalSeparator : string = '.';
    private groupSeparator : string = ',';
    private groupSize : number = 3;
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
        let indexOfLastNecessaryCharacter : number = 0;
        if (moneyString.length === 0)
            throw new Error('Cannot format empty string');
        else if (moneyString.length <= 5) {
            const indexOfCharacterForNine : number = 9;
            indexOfLastNecessaryCharacter = indexOfCharacterForNine + moneyString.length - 1;
        } else {
            const indexOfCharacterForTenThousand : number = 13;
            indexOfLastNecessaryCharacter = indexOfCharacterForTenThousand + Math.trunc((moneyString.length - 5) / 4);
        }

        if (indexOfLastNecessaryCharacter >= this.myriadCharacters.length)
            throw new Error('Not enough characters defined to print myriad string. Use set setMyriadCharacters to define more characters.');

        let result : string =
            (this.symbolPosition === position.FRONT)
                ? (this.currencySymbol + this.symbolSeparator)
                : '';

        moneyString = moneyString.split("").reverse().join("");
        for (let i = 0; i < moneyString.length; i++) {
            let digit : number = 0;
            switch (i) {

                case 0: // 0 - 9
                    digit = parseInt(moneyString.charAt(i));
                    if (digit !== 0)
                        result = this.myriadCharacters[digit] + result;
                    break;
                case 1: // 10
                case 2: // 100
                case 4: // 10000
                    digit = parseInt(moneyString.charAt(i));
                    if (digit !== 0) {
                        let index = 9 + i;
                        if (digit === 1) {
                            result = this.myriadCharacters[index] + result;
                        } else {
                            result = this.myriadCharacters[digit] + this.myriadCharacters[index] + result;
                        }
                    }
                    break;
                case 3: // 1000
                    digit = parseInt(moneyString.charAt(i));
                    if (digit !== 0) {
                        const hundred = 10;
                        result = this.myriadCharacters[digit] + this.myriadCharacters[hundred] + result;
                    }
                    break;

            }

        }


        result += money.getSign();



        if (this.symbolPosition === position.BACK)
            result += this.symbolSeparator + this.currencySymbol;
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
