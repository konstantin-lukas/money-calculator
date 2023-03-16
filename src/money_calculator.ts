import {Money} from "./money";

export class MoneyCalculator {
    /**
     * @param digit1
     * @param digit2
     * @param carry
     * @private
     * @description Adds two number digit strings and returns the result as well as the resulting carry bit in a tuple.
     */
    private static addDigits(digit1 : string, digit2 : string, carry : boolean) : [string, boolean] {
        if (!/^\d$/.test(digit1) || !/^\d$/.test(digit2))
            throw new Error('Strings need to be single ascii digits.');
        let result : number = parseInt(digit1) + parseInt(digit2) + (carry ? 1 : 0);
        let resultString : string = result.toString();
        return [resultString.length === 1 ? resultString : resultString.charAt(1), result >= 10];
    }

    /**
     * @param money1
     * @param money2
     * @description Returns the smaller of the two values. Does not perform a copy / returns the same object as passed in.
     */
    public static min(money1 : Money, money2 : Money) : Money {
        const moneyTmp : Money = MoneyCalculator.max(money1, money2);
        if (moneyTmp !== MoneyCalculator.max(money2, money1) || moneyTmp === money2)
            return money1;
        return money2;
    }
    /**
     * @param money1
     * @param money2
     * @description Returns the larger of the two values. Does not perform a copy / returns the same object as passed in.
     */
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
    /**
     * @param money1 This value will also hold the result.
     * @param money2 This value will get added to the first one.
     * @description Adds two numbers and saves the result in the first one. Also returns reference to the first one.
     */
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
            money1.makeNegative(false);
            money2.makeNegative(false);
            const largerAbs : Money = MoneyCalculator.max(money1, money2);
            const smallerAbs : Money = largerAbs === money1 ? money2 : money1;
            money1.makeNegative(signOne);
            money2.makeNegative(signTwo);

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
            money1.makeNegative(largerAbs.isNegative());
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
            if (carry) integerPartResult = '1' + integerPartResult;
            money1.setIntegerPart(integerPartResult);
        }



        return money1;
    }
    /**
     * @param money1 This value will also hold the result.
     * @param money2 This value will get subtracted from the first one.
     * @description Subtracts two numbers and saves the result in the first one. Also returns reference to the first one.
     */
    public subtract(money1 : Money, money2 : Money) : Money {
        const negative : boolean = money2.isNegative();
        money2.makeNegative(!negative);
        try {
            this.add(money1, money2);
        } catch(error) {
            money2.makeNegative(negative);
            throw error;
        }
        money2.makeNegative(negative);
        return money1;
    }
}

