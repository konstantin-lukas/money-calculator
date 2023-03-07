import {Money} from "../src/money";
import {MoneyCalculator} from "../src/money_calculator";

describe('Money Calculator class', () => {
    let money1 = new Money('10.25');
    let money2 = new Money('399.99');
    let calculator = new MoneyCalculator();
    describe('The add method', () => {
        it('should add two money values', () => {
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('410.24');
        });
        it('should not change the value of the second money value', () => {
            calculator.add(money1, money2);
            expect(money2.getValue()).toBe('399.99');
        });
        it('should add two money values with different integer lengths', () => {
            money1.setValue('390.00');
            money2.setValue('10.00');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('400.00');
            money1.setValue('3090.00');
            money2.setValue('10.00');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('3100.00');
        });
        it('should reject adding two numbers with different floating point precision', () => {
            money1.setValue('390.0');
            money2.setValue('10.00');
            expect(() => calculator.add(money1, money2)).toThrowError();
        });
        it('should add single digit numbers', () => {
            money1.setValue('1');
            money2.setValue('3');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('4');
        });
        it('should add two negative numbers', () => {
            money1.setValue('-112.125');
            money2.setValue('-12.125');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('-124.250');
        });
        it('should add a positive and a negative number', () => {
            money1.setValue('-112.125');
            money2.setValue('12.125');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('-100.000');
            money1.setValue('12.125');
            money2.setValue('-112.125');
            calculator.add(money1, money2);
            expect(money1.getValue()).toBe('-100.000');
        });
    });
    describe('The private addDigits method', () => {
        it('should add two digits and return the result and carry', function () {
            expect(MoneyCalculator['addDigits']('0','0',false)).toEqual(['0',false]);
        });
        it('should reject non-digit characters', function () {
            expect(() => MoneyCalculator['addDigits']('０','0',false)).toThrowError();
            expect(() => MoneyCalculator['addDigits']('10','0',false)).toThrowError();
            expect(() => MoneyCalculator['addDigits']('x','0',false)).toThrowError();
        });
    });
});
