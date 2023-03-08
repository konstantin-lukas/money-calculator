import {Money} from "./money";

enum roundingMode {
    FLOOR,
    CEIL,
    TRUNC
}

export class MoneyCalculator {
    private roundingMode : roundingMode = roundingMode.FLOOR;
    private static addDigits(digit1 : string, digit2 : string, carry : boolean) : [string, boolean] {
        if (!/^\d$/.test(digit1) || !/^\d$/.test(digit2))
            throw new Error('Strings need to be single ascii digits.');
        let result : number = parseInt(digit1) + parseInt(digit2) + (carry ? 1 : 0);
        let resultString : string = result.toString();
        return [resultString.length === 1 ? resultString : resultString.charAt(1), result >= 10];
    }
    public add(money1 : Money, money2 : Money) : Money {
        // TODO: SIGN
        const floatingPointPrecision = money1.getFloatingPointPrecision();
        if (floatingPointPrecision !== money2.getFloatingPointPrecision())
            throw new Error('Amounts to add need to have the same floating point precision.');
        let carry : boolean = false;
        if (floatingPointPrecision > 0) {
            let fractionalPartResult : string = '';
            const fractionalPart1 : string = money1.getFractionalPart();
            const fractionalPart2 : string = money2.getFractionalPart();
            for (let i = floatingPointPrecision - 1; i >= 0; i--) {
                const digitAndCarry : [string, boolean] = MoneyCalculator.addDigits(
                    fractionalPart1.charAt(i),
                    fractionalPart2.charAt(i),
                    carry
                );
                carry = digitAndCarry[1];
                fractionalPartResult = digitAndCarry[0] + fractionalPartResult;
            }
            money1.setFractionalPart(fractionalPartResult);
        }
        let integerPartResult : string = '';
        let integerPart1 : string = money1.getIntegerPart();
        let integerPart2 : string = money2.getIntegerPart();
        integerPart1 = integerPart1.split("").reverse().join("");
        integerPart2 = integerPart2.split("").reverse().join("");
        const longerIntegerPart = Math.max(integerPart1.length, integerPart2.length);
        for (let i = 0; i < longerIntegerPart; i++) {
            const digitAndCarry : [string, boolean] = MoneyCalculator.addDigits(
                i < integerPart1.length ? integerPart1.charAt(i) : '0',
                i < integerPart2.length ? integerPart2.charAt(i) : '0',
                carry
            );
            carry = digitAndCarry[1];
            integerPartResult =  digitAndCarry[0] + integerPartResult;
        }
        money1.setIntegerPart(integerPartResult);
        return money1;
    }
}
