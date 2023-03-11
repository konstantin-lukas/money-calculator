import {Money} from "./money";
import * as assert from "assert";

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
    public static min(money1 : Money, money2 : Money) : Money {
        const moneyTmp : Money = MoneyCalculator.max(money1, money2);
        if (moneyTmp !== MoneyCalculator.max(money2, money1) || moneyTmp === money2)
            return money1;
        return money2;
    }
    public static max(money1 : Money, money2 : Money) : Money {
        const integerPart1 = money1.getIntegerPart();
        const integerPart2 = money2.getIntegerPart();
        if (money1.isNegative() && !money2.isNegative()) {
            return money2;
        } else if (!money1.isNegative() && money2.isNegative()) {
            return money1;
        } else {
            const bothNegative = money1.isNegative() && money2.isNegative();
            if (integerPart1.length > integerPart2.length) {
                return bothNegative ? money2 : money1;
            } else if (integerPart1.length < integerPart2.length) {
                return bothNegative ? money1 : money2;
            } else {
                for (let i = 0; i < integerPart1.length; i++) {
                    let number1 : number = parseInt(integerPart1.charAt(i));
                    let number2 : number = parseInt(integerPart2.charAt(i));
                    if (number1 > number2)
                        return bothNegative ? money2 : money1;
                    else if (number2 > number1)
                        return bothNegative ? money1 : money2;
                }
                const fractionalPart1 = money1.getFractionalPart();
                const fractionalPart2 = money2.getFractionalPart();
                for (let i = 0; i < Math.max(fractionalPart1.length, fractionalPart2.length); i++) {
                    let number1 : number = fractionalPart1.length > i ? parseInt(fractionalPart1.charAt(i)) : 0;
                    let number2 : number = fractionalPart2.length > i ? parseInt(fractionalPart2.charAt(i)) : 0;
                    if (number1 > number2)
                        return bothNegative ? money2 : money1;
                    else if (number2 > number1)
                        return bothNegative ? money1 : money2;
                }
            }
        }
        return money1;
    }
    public add(money1 : Money, money2 : Money) : Money {
        const floatingPointPrecision = money1.getFloatingPointPrecision();
        if (floatingPointPrecision !== money2.getFloatingPointPrecision())
            throw new Error('Amounts to add need to have the same floating point precision.');
        let integerPartResult : string = '';
        let fractionalPartResult : string = '';


        const firstNegSecondPos : boolean = money1.isNegative() && !money2.isNegative();
        const firstPosSecondNeg : boolean = !money1.isNegative() && money2.isNegative();
        if (firstNegSecondPos || firstPosSecondNeg) {
            let borrow : boolean = false;
            const signOne : boolean = money1.isNegative();
            const signTwo : boolean = money2.isNegative();
            money1.setSign(false);
            money2.setSign(false);
            const largerAbs : Money = MoneyCalculator.max(money1, money2);
            const smallerAbs : Money = largerAbs === money1 ? money2 : money1;
            money1.setSign(signOne);
            money2.setSign(signTwo);

            let largerAbsDigit : string = '';
            let smallerAbsDigit : string = '';
            let resultingDigit : string = '';
            for (let j = floatingPointPrecision > 0 ? 0 : 1; j < 2; j++) {
                // j === 0 => FractionalPart
                // j === 1 => IntegerPart
                let largerAbsPart : string = j === 0 ? largerAbs.getFractionalPart() : largerAbs.getIntegerPart();
                let smallerAbsPart : string = j === 0 ? smallerAbs.getFractionalPart() : smallerAbs.getIntegerPart();

                if (j === 1 && largerAbsPart.length > smallerAbsPart.length)
                    smallerAbsPart = '0'.repeat(largerAbsPart.length - smallerAbsPart.length) + smallerAbsPart;

                for (let i = largerAbsPart.length - 1; i >= 0; i--) {
                    largerAbsDigit = largerAbsPart.charAt(i);
                    smallerAbsDigit = smallerAbsPart.charAt(i);
                    if (!/^\d$/.test(largerAbsDigit) || !/^\d$/.test(smallerAbsDigit))
                        throw new Error('Strings need to be single ascii digits.');
                    const largerAbsDigitAsNumber : number = parseInt(largerAbsDigit);
                    const smallerAbsDigitAsNumber : number = parseInt(smallerAbsDigit) + (borrow ? 1 : 0);
                    if (largerAbsDigitAsNumber >= smallerAbsDigitAsNumber) {
                        resultingDigit = (largerAbsDigitAsNumber - smallerAbsDigitAsNumber).toString();
                        borrow = false;
                    } else {
                        resultingDigit = (10 - (smallerAbsDigitAsNumber - largerAbsDigitAsNumber)).toString();
                        borrow = true;
                    }

                    if (j === 0) {
                        fractionalPartResult = resultingDigit + fractionalPartResult;
                    } else {
                        integerPartResult = resultingDigit + integerPartResult;
                    }
                }

                if (j === 0) {
                    money1.setFractionalPart(fractionalPartResult);
                }
            }

            money1.setIntegerPart(integerPartResult === '0' ? '0' : integerPartResult.replace(/^0+/, ''));
            money1.setSign(largerAbs.isNegative());
        } else {
            let integerPart1 : string = money1.getIntegerPart();
            let integerPart2 : string = money2.getIntegerPart();
            const longerIntegerPart : number = Math.max(integerPart1.length, integerPart2.length);
            integerPart1 = integerPart1.split("").reverse().join("");
            integerPart2 = integerPart2.split("").reverse().join("");
            let carry : boolean = false;
            if (floatingPointPrecision > 0) {
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
        }



        return money1;
    }
}
