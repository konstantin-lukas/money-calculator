import {Money} from "../src/money";


describe('Money class', () => {
    let moneyValue = new Money('251.2512');
    describe('The constructor', () => {
        it('should set the initial value of the object according to number', () => {
            expect(moneyValue.getValue()).toBe('251.2512');
        });
    });
    describe('The setValue method', () => {
        it('should handle negative numbers', () => {
            moneyValue.setValue('-12.521235612623');
            expect(moneyValue.getValue()).toBe('-12.521235612623');
        });
        it('should handle integers and set the digit count to zero', () => {
            moneyValue.setValue('12');
            expect(moneyValue.getValue()).toBe('12');
        });
        it('should handle negative integers and set the digit count to zero', () => {
            moneyValue.setValue('-252');
            expect(moneyValue.getValue()).toBe('-252');
            expect(moneyValue.getIntegerPart()).toBe('252');
            expect(moneyValue.getSign()).toBe('-');
        });
        it('should handle large integers', () => {
            moneyValue.setValue('253867238967239085902389590239502395232');
            expect(moneyValue.getValue()).toBe('253867238967239085902389590239502395232');
        });
        it('should handle precise floating point numbers', () => {
            moneyValue.setValue('-0.0000000000000000000000000000000000000000000000000000000001');
            expect(moneyValue.getFractionalPart()).toBe('0000000000000000000000000000000000000000000000000000000001');
            expect(moneyValue.getFloatingPointPrecision()).toBe(58);
            expect(moneyValue.getValue()).toBe('-0.0000000000000000000000000000000000000000000000000000000001');
        });
        it('should reject invalid numbers', function () {
            expect(() => {
                moneyValue.setValue('1F');
            }).toThrowError();
            expect(() => {
                moneyValue.setValue('Seven');
            }).toThrowError();
            expect(() => {
                moneyValue.setValue('.5');
            }).toThrowError();
            expect(() => {
                moneyValue.setValue('--1');
            }).toThrowError();
        });
        it('should interpret -0 as 0', () => {
            moneyValue.setValue('-0');
            expect(moneyValue.getSign()).toBe('');
        });
    });
    describe('The setIntegerPart method', function () {
        it('should reject non integer inputs', function () {
            expect(() => {
                moneyValue.setIntegerPart('1.1');
            }).toThrowError();
            expect(() => {
                moneyValue.setIntegerPart('-1');
            }).toThrowError();
        });
        it('should set the integer part', function () {
            moneyValue.setIntegerPart('125');
            expect(moneyValue.getIntegerPart()).toBe('125');
        });
    });
    describe('The setFractionalPart method', function () {
        it('should reject non integer inputs', function () {
            expect(() => {
                moneyValue.setFractionalPart('1.1');
            }).toThrowError();
            expect(() => {
                moneyValue.setFractionalPart('-1');
            }).toThrowError();
        });
        it('should set the fractional part', function () {
            moneyValue.setFractionalPart('125');
            expect(moneyValue.getFractionalPart()).toBe('125');
            expect(moneyValue.getFloatingPointPrecision()).toBe(3);
        });
    });
});
