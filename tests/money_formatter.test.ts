import {Money} from "../src/money";
import {MoneyFormatter, myriadMode, signDisplayMode, symbolPosition} from "../src/money_formatter";

describe('Money Formatter class', () => {
    describe('The private addDigits method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should format a string to USD by default', () => {
            expect(formatter.format(money)).toBe('$ 1,000.00');
            money.value = '10000.00';
            expect(formatter.format(money)).toBe('$ 10,000.00');
            money.value = '100000.00';
            expect(formatter.format(money)).toBe('$ 100,000.00');
            money.value = '1000000.00';
            expect(formatter.format(money)).toBe('$ 1,000,000.00');
            money.value = '10000000.00';
            expect(formatter.format(money)).toBe('$ 10,000,000.00');
            money.value = '100000000.00';
            expect(formatter.format(money)).toBe('$ 100,000,000.00');
            money.value = '1000000000.00';
            expect(formatter.format(money)).toBe('$ 1,000,000,000.00');
            money.value = '-1.00';
            expect(formatter.format(money)).toBe('-$ 1.00');
            money.value = '-1';
            expect(formatter.format(money)).toBe('-$ 1');
        });
    });
    describe('The setSymbol method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the position of the currency symbol when formatting', () => {
            formatter.symbolPosition = symbolPosition.BACK;
            money.value = '-1';
            expect(formatter.format(money)).toBe('-1 $');
        });
    });
    describe('The setDigitCharacters', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should set the characters used for the digits', () => {
            formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八','九'];
            formatter.symbolPosition = symbolPosition.FRONT;
            money.value = '1000.00';
            expect(formatter.format(money)).toBe('$ 一,○○○.○○');
        });
        it('should reject string longer or shorter than length 10', () => {
            expect(() => formatter.digitCharacters = []).toThrowError();
            expect(() => formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八']).toThrowError();
            expect(() => formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八','九','十']).toThrowError();
        });
    });
    describe('The setSymbolSeparator should set the string that separates the currency symbol from the numbers', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        formatter.symbolSeparator = '';
        expect(formatter.format(money)).toBe('$1,000.00');
        formatter.symbolPosition = symbolPosition.BACK;
        expect(formatter.format(money)).toBe('1,000.00$');
    });
    describe('The getFormattedMyriadString method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should reject money values with decimal places', () => {
            expect(() => formatter.formatMyriad(money)).toThrowError();
        });
    });
    describe('The getFormattedMyriadString method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1500');
        formatter.symbolPosition = symbolPosition.BACK;
        formatter.symbolSeparator = '';
        it('should return the currency in a myriad format like in many east asian languages', () => {
            expect(formatter.formatMyriad(money)).toBe('千5百$');
            money.value = '150';
            expect(formatter.formatMyriad(money)).toBe('百5十$');
            money.value = '15';
            expect(formatter.formatMyriad(money)).toBe('十5$');
            money.value = '5';
            expect(formatter.formatMyriad(money)).toBe('5$');
            money.value = '15233';
            expect(formatter.formatMyriad(money)).toBe('1万5千2百3十3$');
            money.value = '215233';
            expect(formatter.formatMyriad(money)).toBe('2十1万5千2百3十3$');
            money.value = '5215233';
            expect(formatter.formatMyriad(money)).toBe('5百2十1万5千2百3十3$');
            money.value = '15215233';
            expect(formatter.formatMyriad(money)).toBe('1千5百2十1万5千2百3十3$');
            money.value = '25215233';
            expect(formatter.formatMyriad(money)).toBe('2千5百2十1万5千2百3十3$');
            money.value = '125215233';
            expect(formatter.formatMyriad(money)).toBe('1億2千5百2十1万5千2百3十3$');
            money.value = '225215233';
            expect(formatter.formatMyriad(money)).toBe('2億2千5百2十1万5千2百3十3$');
            money.value = '1000225215233';
            expect(formatter.formatMyriad(money)).toBe('1兆2億2千5百2十1万5千2百3十3$');
            money.value = '1152225215233';
            expect(formatter.formatMyriad(money)).toBe('1兆1千5百2十2億2千5百2十1万5千2百3十3$');
            money.value = '1000000000000';
            expect(formatter.formatMyriad(money)).toBe('1兆$');
            money.value = '1000010000000';
            expect(formatter.formatMyriad(money)).toBe('1兆1千万$');
            money.value = '10000000';
            expect(formatter.formatMyriad(money)).toBe('1千万$');
            money.value = '1000';
            expect(formatter.formatMyriad(money)).toBe('千$');
            money.value = '52025215233';
            expect(formatter.formatMyriad(money)).toBe('5百2十億2千5百2十1万5千2百3十3$');
            money.value = '51025215233';
            expect(formatter.formatMyriad(money)).toBe('5百十億2千5百2十1万5千2百3十3$');
            money.value = '11025215233';
            expect(formatter.formatMyriad(money)).toBe('百十億2千5百2十1万5千2百3十3$');
            money.value = '11025215233110252152331102521523311025215233110252152331102521523311025215233110252152331102521523311025215233110252152331102521523311025215233';
            expect(() => formatter.formatMyriad(money)).toThrowError();
            money.value = '0';
            expect(formatter.formatMyriad(money)).toBe('0$');
            formatter.symbolPosition = symbolPosition.FRONT;
            expect(formatter.formatMyriad(money)).toBe('$0');
            money.value = '10';
            expect(formatter.formatMyriad(money)).toBe('$十');
            money.value = '20';
            expect(formatter.formatMyriad(money)).toBe('$2十');
        });
    });
    describe('The setMyriadCharacters method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the characters used by the myriad formatter', () => {
            formatter.myriadCharacters = ['OOF','YIKES'];
            expect(() => formatter.formatMyriad(money)).toThrowError();
            money.value = '54';
            expect(formatter.formatMyriad(money)).toBe('$ 5OOF4');
            money.value = '254';
            expect(formatter.formatMyriad(money)).toBe('$ 2YIKES5OOF4');
            money.value = '-254';
            expect(formatter.formatMyriad(money)).toBe('$ -2YIKES5OOF4');
            formatter.myriadMode = myriadMode.CHINESE;
            expect(() => formatter.formatMyriad(money)).toThrowError();
        });
    });
    describe('The setSignDisplayMode method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('-999.99');
        it('should change the state of the object to mode "BEFORE" ', () => {
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('-$ 999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('$ 999.99-');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('($ 999.99)');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('$ -999.99');

            formatter.symbolPosition = symbolPosition.BACK;
            expect(formatter.format(money)).toBe('999.99- $');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('(999.99 $)');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99 $-');
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('-999.99 $');

            money.isNegative = false;

            formatter.symbolPosition = symbolPosition.FRONT;
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('$ 999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('$ 999.99');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('$ 999.99');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('$ 999.99');

            formatter.symbolPosition = symbolPosition.BACK;
            expect(formatter.format(money)).toBe('999.99 $');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('999.99 $');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99 $');
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('999.99 $');

            formatter.currencySymbol = '';
            formatter.symbolPosition = symbolPosition.FRONT;
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('999.99');

            formatter.symbolPosition = symbolPosition.BACK;
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('999.99');

            formatter.positiveSign = '+';

            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('+999.99');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99+');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('999.99');

            money.isNegative = true;
            formatter.symbolPosition = symbolPosition.FRONT;
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('-999.99');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99-');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('(999.99)');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('999.99');

            formatter.negativeSign = '';
            formatter.signDisplayMode = signDisplayMode.BEFORE;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('(999.99)');
            formatter.signDisplayMode = signDisplayMode.AFTER;
            expect(formatter.format(money)).toBe('999.99');
            formatter.signDisplayMode = signDisplayMode.BETWEEN;
            expect(formatter.format(money)).toBe('999.99');

            formatter.signSeparator = ' ';
            money.isNegative = true;
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('( 999.99 )');
            money.value = '-1999.9999';
            expect(formatter.format(money)).toBe('( 1,999.9999 )');
        });
    });
    describe('The setter methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('-9999.99');
        it('should have an impact on formatting in at least one scenario', () => {
            expect(formatter.format(money)).toBe('-$ 9,999.99');
            formatter.decimalSeparator = ',';
            expect(formatter.format(money)).toBe('-$ 9,999,99');
            expect(() => formatter.groupSize = -1).toThrowError();
            formatter.groupSize = 1;
            expect(formatter.format(money)).toBe('-$ 9,9,9,9,99');
            formatter.groupSeparator = '.';
            expect(formatter.format(money)).toBe('-$ 9.9.9.9,99');
            formatter.openingParenthesis = '[';
            formatter.closingParenthesis = ']';
            formatter.signDisplayMode = signDisplayMode.PARENTHESES;
            expect(formatter.format(money)).toBe('[$ 9.9.9.9,99]');
        });
    });
    describe('The getter methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        it('should return the respective private member', () => {
            expect(formatter.currencySymbol).toBe('$');
            expect(formatter.decimalSeparator).toBe('.');
            expect(formatter.digitCharacters).toEqual(['0','1','2','3','4','5','6','7','8','9']);
            expect(formatter.digitCharacters).not.toBe(formatter['digitCharacters']);
            expect(formatter.myriadCharacters).toEqual([
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
            ]);
            expect(formatter.myriadCharacters).not.toBe(formatter['myriadCharacters']);
            expect(formatter.groupSeparator).toBe(',');
            expect(formatter.groupSize).toBe(3);
            expect(formatter.openingParenthesis).toBe('(');
            expect(formatter.closingParenthesis).toBe(')');
            expect(formatter.negSign).toBe('-');
            expect(formatter.posSign).toBe('');
            expect(formatter.signDisplayMode).toBe(signDisplayMode.BEFORE);
            expect(formatter.signSeparator).toBe('');
            expect(formatter.symbolSeparator).toBe(' ');
            expect(formatter.symbolPosition).toBe(symbolPosition.FRONT);
            expect(formatter.myriadMode).toBe(myriadMode.JAPANESE);
        });

    });
});
