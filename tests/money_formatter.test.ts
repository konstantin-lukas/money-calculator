import {Money} from "../src/money";
import {MoneyFormatter} from "../src/money_formatter";

describe('Money Formatter class', () => {
    let formatter : MoneyFormatter = new MoneyFormatter();
    let money : Money = new Money('1000.00');
    describe('The private addDigits method', () => {
        it('should format a string to USD by default', function () {
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
        });
    });
    describe('The setDigitCharacters', () => {
        it('should set the characters used for the digits', function () {
            formatter.setDigitCharacters('○一二三四五六七八九')
            money.setValue('1000.00');
            expect(formatter.getFormattedString(money)).toBe('$ 一,○○○.○○');
        });
    });
});
