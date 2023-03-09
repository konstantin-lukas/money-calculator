import {Money} from "../src/money";
import {MoneyFormatter, position} from "../src/money_formatter";

describe('Money Formatter class', () => {
    describe('The private addDigits method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should format a string to USD by default', () => {
            expect(formatter.getFormattedString(money)).toBe('$ 1,000.00');
            money.setValue('10000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 10,000.00');
            money.setValue('100000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 100,000.00');
            money.setValue('1000000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 1,000,000.00');
            money.setValue('10000000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 10,000,000.00');
            money.setValue('100000000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 100,000,000.00');
            money.setValue('1000000000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 1,000,000,000.00');
            money.setValue('-1.00');
            expect(formatter.getFormattedString(money)).toBe('$ -1.00');
            money.setValue('-1');
            expect(formatter.getFormattedString(money)).toBe('$ -1');
        });
    });
    describe('The setSymbol method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the position of the currency symbol when formatting', () => {
            formatter.setSymbolPosition(position.BACK);
            money.setValue('-1');
            expect(formatter.getFormattedString(money)).toBe('-1 $');
        });
    });
    describe('The setDigitCharacters', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should set the characters used for the digits', () => {
            formatter.setDigitCharacters(['○','一','二','三','四','五','六','七','八','九'])
            formatter.setSymbolPosition(position.FRONT);
            money.setValue('1000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 一,○○○.○○');
        });
        it('should reject string longer or shorter than length 10', () => {
            expect(() => formatter.setDigitCharacters([])).toThrowError();
            expect(() => formatter.setDigitCharacters(['○','一','二','三','四','五','六','七','八'])).toThrowError();
            expect(() => formatter.setDigitCharacters(['○','一','二','三','四','五','六','七','八','九','十'])).toThrowError();
        });
    });
    describe('The setSymbolSeparator should set the string that separates the currency symbol from the numbers', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        formatter.setSymbolSeparator('');
        expect(formatter.getFormattedString(money)).toBe('$1,000.00');
        formatter.setSymbolPosition(position.BACK);
        expect(formatter.getFormattedString(money)).toBe('1,000.00$');
    });
    describe('The getFormattedMyriadString method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should reject money values with decimal places', () => {
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
        });
    });
    describe('The getFormattedMyriadString method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1500');
        it('should return the currency in a myriad format like in many east asian languages', () => {
            expect(formatter.getFormattedMyriadString(money)).toBe('$ 千五百');
        });
    });
    describe('The setMyriadCharacters method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the characters used by the myriad formatter', () => {
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
        });
    });
});
