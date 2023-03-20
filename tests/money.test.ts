import {Money} from "../src/money";
import {displayOrder} from "../src/money_formatter";


describe('Money class', () => {
    let moneyValue = new Money('251.2512');
    describe('The constructor', () => {
        it('should set the initial value of the object according to number', () => {
            expect(moneyValue.value).toBe('251.2512');
        });
    });
    describe('The isNull method should return true iff the value equals 0', () => {
        it('should set the initial value of the object according to number', () => {
            moneyValue.value = '0.000000';
            expect(moneyValue.isNull()).toBe(true);
            moneyValue.value = '-0.000000';
            expect(moneyValue.isNull()).toBe(true);
            moneyValue.value = '-0';
            expect(moneyValue.isNull()).toBe(true);
            moneyValue.value = '0.0';
            expect(moneyValue.isNull()).toBe(true);
            moneyValue.isNegative = true;
            expect(moneyValue.value).toBe('0.0');
            moneyValue.value = '0.1';
            expect(moneyValue.isNull()).toBe(false);
            moneyValue.isNegative = true;
            expect(moneyValue.value).toBe('-0.1');
        });
    });
    describe('The setValue method', () => {
        it('should handle negative numbers', () => {
            moneyValue.value = '-12.521235612623';
            expect(moneyValue.value).toBe('-12.521235612623');
        });
        it('should handle integers and set the digit count to zero', () => {
            moneyValue.value = '12';
            expect(moneyValue.value).toBe('12');
        });
        it('should handle negative integers and set the digit count to zero', () => {
            moneyValue.value = '-252';
            expect(moneyValue.value).toBe('-252');
            expect(moneyValue.integerPart).toBe('252');
            expect(moneyValue.isNegative).toBe(true);
        });
        it('should handle large integers', () => {
            moneyValue.value = '253867238967239085902389590239502395232';
            expect(moneyValue.value).toBe('253867238967239085902389590239502395232');
        });
        it('should handle precise floating point numbers', () => {
            moneyValue.value = '-0.0000000000000000000000000000000000000000000000000000000001';
            expect(moneyValue.fractionalPart).toBe('0000000000000000000000000000000000000000000000000000000001');
            expect(moneyValue.floatingPointPrecision).toBe(58);
            expect(moneyValue.value).toBe('-0.0000000000000000000000000000000000000000000000000000000001');
        });
        it('should reject invalid numbers', function () {
            expect(() => {
                moneyValue.value = '1F';
            }).toThrowError();
            expect(() => {
                moneyValue.value = 'Seven';
            }).toThrowError();
            expect(() => {
                moneyValue.value = '.5';
            }).toThrowError();
            expect(() => {
                moneyValue.value = '--1';
            }).toThrowError();
            expect(() => {
                moneyValue.value = '';
            }).toThrowError();
        });
        it('should interpret -0 as 0', () => {
            moneyValue.value = '-0';
            expect(moneyValue.isNegative).toBe(false);
        });
    });
    describe('The setIntegerPart method', function () {
        it('should reject non integer inputs', function () {
            expect(() => {
                moneyValue.integerPart = '1.1';
            }).toThrowError();
            expect(() => {
                moneyValue.integerPart = '-1';
            }).toThrowError();
        });
        it('should set the integer part', function () {
            moneyValue.integerPart = '125';
            expect(moneyValue.integerPart).toBe('125');
            moneyValue.isNegative = true;
            moneyValue.integerPart = '0';
            moneyValue.fractionalPart = '0';
            expect(moneyValue.value).toBe('0.0');
            expect(moneyValue.isNegative).toBe(false);
        });
    });
    describe('The setFractionalPart method', function () {
        it('should reject non integer inputs', function () {
            expect(() => {
                moneyValue.fractionalPart = '1.1';
            }).toThrowError();
            expect(() => {
                moneyValue.fractionalPart = '-1';
            }).toThrowError();
        });
        it('should set the fractional part', function () {
            moneyValue.fractionalPart = '125';
            expect(moneyValue.fractionalPart).toBe('125');
            expect(moneyValue.floatingPointPrecision).toBe(3);
        });
    });
});
