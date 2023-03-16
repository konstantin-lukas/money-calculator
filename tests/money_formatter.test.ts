import {Money} from "../src/money";
import {MoneyFormatter, myriadMode, signDisplayMode, symbolPosition} from "../src/money_formatter";

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
            expect(formatter.getFormattedString(money)).toBe('-$ 1.00');
            money.setValue('-1');
            expect(formatter.getFormattedString(money)).toBe('-$ 1');
        });
    });
    describe('The setSymbol method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the position of the currency symbol when formatting', () => {
            formatter.setSymbolPosition(symbolPosition.BACK);
            money.setValue('-1');
            expect(formatter.getFormattedString(money)).toBe('-1 $');
        });
    });
    describe('The setDigitCharacters', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should set the characters used for the digits', () => {
            formatter.setDigitCharacters(['○','一','二','三','四','五','六','七','八','九'])
            formatter.setSymbolPosition(symbolPosition.FRONT);
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
        formatter.setSymbolPosition(symbolPosition.BACK);
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
        formatter.setSymbolPosition(symbolPosition.BACK);
        formatter.setSymbolSeparator('');
        it('should return the currency in a myriad format like in many east asian languages', () => {
            expect(formatter.getFormattedMyriadString(money)).toBe('千5百$');
            money.setValue('150');
            expect(formatter.getFormattedMyriadString(money)).toBe('百5十$');
            money.setValue('15');
            expect(formatter.getFormattedMyriadString(money)).toBe('十5$');
            money.setValue('5');
            expect(formatter.getFormattedMyriadString(money)).toBe('5$');
            money.setValue('15233');
            expect(formatter.getFormattedMyriadString(money)).toBe('1万5千2百3十3$');
            money.setValue('215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('2十1万5千2百3十3$');
            money.setValue('5215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('5百2十1万5千2百3十3$');
            money.setValue('15215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('1千5百2十1万5千2百3十3$');
            money.setValue('25215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('2千5百2十1万5千2百3十3$');
            money.setValue('125215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('1億2千5百2十1万5千2百3十3$');
            money.setValue('225215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('2億2千5百2十1万5千2百3十3$');
            money.setValue('1000225215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('1兆2億2千5百2十1万5千2百3十3$');
            money.setValue('1152225215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('1兆1千5百2十2億2千5百2十1万5千2百3十3$');
            money.setValue('1000000000000');
            expect(formatter.getFormattedMyriadString(money)).toBe('1兆$');
            money.setValue('1000010000000');
            expect(formatter.getFormattedMyriadString(money)).toBe('1兆1千万$');
            money.setValue('10000000');
            expect(formatter.getFormattedMyriadString(money)).toBe('1千万$');
            money.setValue('1000');
            expect(formatter.getFormattedMyriadString(money)).toBe('千$');
            money.setValue('52025215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('5百2十億2千5百2十1万5千2百3十3$');
            money.setValue('51025215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('5百十億2千5百2十1万5千2百3十3$');
            money.setValue('11025215233');
            expect(formatter.getFormattedMyriadString(money)).toBe('百十億2千5百2十1万5千2百3十3$');
            money.setValue('11025215233110252152331102521523311025215233110252152331102521523311025215233110252152331102521523311025215233110252152331102521523311025215233');
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
            money.setValue('0');
            expect(formatter.getFormattedMyriadString(money)).toBe('0$');
            formatter.setSymbolPosition(symbolPosition.FRONT);
            expect(formatter.getFormattedMyriadString(money)).toBe('$0');
            money.setValue('10');
            expect(formatter.getFormattedMyriadString(money)).toBe('$十');
            money.setValue('20');
            expect(formatter.getFormattedMyriadString(money)).toBe('$2十');
        });
    });
    describe('The setMyriadCharacters method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('1000.00');
        it('should change the characters used by the myriad formatter', () => {
            formatter.setMyriadCharacters(['OOF','YIKES']);
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
            money.setValue('54');
            expect(formatter.getFormattedMyriadString(money)).toBe('$ 5OOF4');
            money.setValue('254');
            expect(formatter.getFormattedMyriadString(money)).toBe('$ 2YIKES5OOF4');
            money.setValue('-254');
            expect(formatter.getFormattedMyriadString(money)).toBe('$ -2YIKES5OOF4');
            formatter.setMyriadMode(myriadMode.CHINESE);
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
        });
    });
    describe('The setSignDisplayMode method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('-999.99');
        it('should change the state of the object to mode "BEFORE" ', () => {
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('-$ 999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('$ 999.99-');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('($ 999.99)');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('$ -999.99');

            formatter.setSymbolPosition(symbolPosition.BACK);
            expect(formatter.getFormattedString(money)).toBe('999.99- $');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('(999.99 $)');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99 $-');
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('-999.99 $');

            money.makeNegative(false);

            formatter.setSymbolPosition(symbolPosition.FRONT);
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('$ 999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('$ 999.99');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('$ 999.99');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('$ 999.99');

            formatter.setSymbolPosition(symbolPosition.BACK);
            expect(formatter.getFormattedString(money)).toBe('999.99 $');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('999.99 $');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99 $');
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('999.99 $');

            formatter.setCurrencySymbol('');
            formatter.setSymbolPosition(symbolPosition.FRONT);
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('999.99');

            formatter.setSymbolPosition(symbolPosition.BACK);
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('999.99');

            formatter.setPositiveSign('+');

            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('+999.99');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99+');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('999.99');

            money.makeNegative(true);
            formatter.setSymbolPosition(symbolPosition.FRONT);
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('-999.99');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99-');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('(999.99)');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('999.99');

            formatter.setNegativeSign('');
            formatter.setSignDisplayMode(signDisplayMode.BEFORE);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('(999.99)');
            formatter.setSignDisplayMode(signDisplayMode.AFTER);
            expect(formatter.getFormattedString(money)).toBe('999.99');
            formatter.setSignDisplayMode(signDisplayMode.BETWEEN);
            expect(formatter.getFormattedString(money)).toBe('999.99');

            formatter.setSignSeparator(' ');
            money.makeNegative(true);
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('( 999.99 )');
            money.setValue('-1999.9999');
            expect(formatter.getFormattedString(money)).toBe('( 1,999.9999 )');
        });
    });
    describe('The setter methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        let money : Money = new Money('-9999.99');
        it('should have an impact on formatting in at least one scenario', () => {
            expect(formatter.getFormattedString(money)).toBe('-$ 9,999.99');
            formatter.setDecimalSeparator(',');
            expect(formatter.getFormattedString(money)).toBe('-$ 9,999,99');
            expect(() => formatter.setGroupSize(-1)).toThrowError();
            formatter.setGroupSize(1);
            expect(formatter.getFormattedString(money)).toBe('-$ 9,9,9,9,99');
            formatter.setGroupSeparator('.');
            expect(formatter.getFormattedString(money)).toBe('-$ 9.9.9.9,99');
            formatter.setOpeningParenthesis('[');
            formatter.setClosingParenthesis(']');
            formatter.setSignDisplayMode(signDisplayMode.PARENTHESES);
            expect(formatter.getFormattedString(money)).toBe('[$ 9.9.9.9,99]');
        });
    });
    describe('The getter methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter();
        it('should return the respective private member', () => {
            expect(formatter.getCurrencySymbol()).toBe('$');
            expect(formatter.getDecimalSeparator()).toBe('.');
            expect(formatter.getDigitCharacters()).toEqual(['0','1','2','3','4','5','6','7','8','9']);
            expect(formatter.getDigitCharacters()).not.toBe(formatter['digitCharacters']);
            expect(formatter.getMyriadCharacters()).toEqual([
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
            expect(formatter.getMyriadCharacters()).not.toBe(formatter['myriadCharacters']);
            expect(formatter.getGroupSeparator()).toBe(',');
            expect(formatter.getGroupSize()).toBe(3);
            expect(formatter.getOpeningParenthesis()).toBe('(');
            expect(formatter.getClosingParenthesis()).toBe(')');
            expect(formatter.getNegSign()).toBe('-');
            expect(formatter.getPosSign()).toBe('');
            expect(formatter.getSignDisplayMode()).toBe(signDisplayMode.BEFORE);
            expect(formatter.getSignSeparator()).toBe('');
            expect(formatter.getSymbolSeparator()).toBe(' ');
            expect(formatter.getSymbolPosition()).toBe(symbolPosition.FRONT);
            expect(formatter.getMyriadMode()).toBe(myriadMode.JAPANESE);
        });

    });
});
