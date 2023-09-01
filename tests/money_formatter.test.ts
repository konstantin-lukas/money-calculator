import {Money} from "../src/money";
import {DisplayOrder, MoneyFormatter, MyriadMode} from "../src/money_formatter";

describe('Money Formatter class', () => {
    describe('The private addDigits method', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('1000.00');
        it('should format a string to USD by default', () => {
            expect(formatter.format(money)).toBe('$1,000.00');
            money.value = '10000.00';
            expect(formatter.format(money)).toBe('$10,000.00');
            money.value = '100000.00';
            expect(formatter.format(money)).toBe('$100,000.00');
            money.value = '1000000.00';
            expect(formatter.format(money)).toBe('$1,000,000.00');
            money.value = '10000000.00';
            expect(formatter.format(money)).toBe('$10,000,000.00');
            money.value = '100000000.00';
            expect(formatter.format(money)).toBe('$100,000,000.00');
            money.value = '1000000000.00';
            expect(formatter.format(money)).toBe('$1,000,000,000.00');
            money.value = '-1.00';
            expect(formatter.format(money)).toBe('-$1.00');
            money.value = '-1';
            expect(formatter.format(money)).toBe('-$1');
        });
    });
    describe('The setDigitCharacters', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('1000.00');
        it('should set the characters used for the digits', () => {
            formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八','九'];
            money.value = '1000.00';
            expect(formatter.format(money)).toBe('$一,○○○.○○');
        });
        it('should reject string longer or shorter than length 10', () => {
            expect(() => formatter.digitCharacters = []).toThrowError();
            expect(() => formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八']).toThrowError();
            expect(() => formatter.digitCharacters = ['○','一','二','三','四','五','六','七','八','九','十']).toThrowError();
        });
    });
    describe('The setSymbolSeparator should set the string that separates the currency symbol from the numbers', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('1000.00');
        formatter.symbolSeparator = '';
        expect(formatter.format(money)).toBe('$1,000.00');
    });
    describe('The formatMyriad method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        const moneyInvalid : Money = new Money('1000.00');
        it('should reject money values with decimal places', () => {
            expect(() => formatter.formatMyriad(moneyInvalid)).toThrowError();
        });
        let money : Money = new Money('1500');
        formatter.displayOrder = DisplayOrder.SIGN_NUMBER_SYMBOL_NAME;
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
            formatter.displayOrder = DisplayOrder.SIGN_SYMBOL_NUMBER_NAME;
            expect(formatter.formatMyriad(money)).toBe('$0');
            money.value = '10';
            expect(formatter.formatMyriad(money)).toBe('$十');
            money.value = '20';
            expect(formatter.formatMyriad(money)).toBe('$2十');
        });
    });
    describe('The myriadCharacters method should', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('1000.00');
        it('should change the characters used by the myriad formatter', () => {
            formatter.myriadCharacters = ['OOF','YIKES'];
            expect(() => formatter.formatMyriad(money)).toThrowError();
            money.value = '54';
            expect(formatter.formatMyriad(money)).toBe('$5OOF4');
            money.value = '254';
            expect(formatter.formatMyriad(money)).toBe('$2YIKES5OOF4');
            money.value = '-254';
            expect(formatter.formatMyriad(money)).toBe('-$2YIKES5OOF4');
            formatter.myriadMode = MyriadMode.CHINESE;
            expect(() => formatter.formatMyriad(money)).toThrowError();
        });
    });
    describe('The setter/getter methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('-9999.99');
        it('should have an impact on formatting in at least one scenario', () => {
            formatter.symbolSeparator = '';
            expect(formatter.format(money)).toBe('-$9,999.99');
            formatter.decimalSeparator = ',';
            expect(formatter.format(money)).toBe('-$9,999,99');
            expect(() => formatter.groupSize = -1).toThrowError();
            formatter.groupSize = 1;
            expect(formatter.format(money)).toBe('-$9,9,9,9,99');
            formatter.groupSeparator = '.';
            expect(formatter.format(money)).toBe('-$9.9.9.9,99');
            formatter.negativeSign = 'minus';
            formatter.signSeparator = ' ';
            expect(formatter.format(money)).toBe('minus $9.9.9.9,99');
            formatter.positiveSign = '+';
            formatter.signSeparator = '';
            money.isNegative = false;
            expect(formatter.format(money)).toBe('+$9.9.9.9,99');
            formatter.displayOrder = DisplayOrder.NUMBER_NAME_SIGN_SYMBOL;
            formatter.currencyName = 'USD';
            formatter.nameSeparator = ' ';
            expect(formatter.format(money)).toBe('9.9.9.9,99 USD+$');
        });
        it('should return the respective private member', () => {
            expect(formatter.currencySymbol).toBe('$');
            expect(formatter.decimalSeparator).toBe(',');
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
            expect(formatter.groupSeparator).toBe('.');
            expect(formatter.groupSize).toBe(1);
            expect(formatter.negativeSign).toBe('minus');
            expect(formatter.positiveSign).toBe('+');
            expect(formatter.signSeparator).toBe('');
            expect(formatter.symbolSeparator).toBe('');
            expect(formatter.myriadMode).toBe(MyriadMode.JAPANESE);
            expect(formatter.displayOrder).toBe(DisplayOrder.NUMBER_NAME_SIGN_SYMBOL);
            expect(formatter.currencyName).toBe('USD');
            expect(formatter.nameSeparator).toBe(' ');
        });
    });
    describe('The currencyName methods', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('1.00');
        it('should change the way the name of the currency is displayed', () => {
            formatter.displayOrder = DisplayOrder.SIGN_SYMBOL_NUMBER_NAME;
            expect(formatter.format(money)).toBe('$1.00');
            formatter.nameSeparator = ' ';
            formatter.currencyName = 'USD';
            expect(formatter.format(money)).toBe('$1.00 USD')
        });

    });
    describe('The display order', () => {
        let formatter : MoneyFormatter = new MoneyFormatter({});
        let money : Money = new Money('-199.99');
        formatter.signSeparator = ' ';
        formatter.nameSeparator = ' ';
        formatter.symbolSeparator = ' ';
        formatter.currencyName = 'USD';
        formatter.currencySymbol = '$';
        formatter.negativeSign = '-';
        it('should change the order of the format function', () => {
            formatter.displayOrder = DisplayOrder.SIGN_SYMBOL_NAME_NUMBER;
            expect(formatter.format(money)).toBe('- $ USD 199.99');
            formatter.displayOrder = DisplayOrder.SIGN_NAME_SYMBOL_NUMBER;
            expect(formatter.format(money)).toBe('- USD $ 199.99');
            formatter.displayOrder = DisplayOrder.SIGN_SYMBOL_NUMBER_NAME;
            expect(formatter.format(money)).toBe('- $ 199.99 USD');
            formatter.displayOrder = DisplayOrder.SIGN_NAME_NUMBER_SYMBOL;
            expect(formatter.format(money)).toBe('- USD 199.99 $');
            formatter.displayOrder = DisplayOrder.SIGN_NUMBER_SYMBOL_NAME;
            expect(formatter.format(money)).toBe('- 199.99 $ USD');
            formatter.displayOrder = DisplayOrder.SIGN_NUMBER_NAME_SYMBOL;
            expect(formatter.format(money)).toBe('- 199.99 USD $');
            formatter.displayOrder = DisplayOrder.SYMBOL_SIGN_NAME_NUMBER;
            expect(formatter.format(money)).toBe('$ - USD 199.99');
            formatter.displayOrder = DisplayOrder.SYMBOL_NAME_SIGN_NUMBER;
            expect(formatter.format(money)).toBe('$ USD - 199.99');
            formatter.displayOrder = DisplayOrder.SYMBOL_SIGN_NUMBER_NAME;
            expect(formatter.format(money)).toBe('$ - 199.99 USD');
            formatter.displayOrder = DisplayOrder.SYMBOL_NAME_NUMBER_SIGN;
            expect(formatter.format(money)).toBe('$ USD 199.99 -');
            formatter.displayOrder = DisplayOrder.SYMBOL_NUMBER_SIGN_NAME;
            expect(formatter.format(money)).toBe('$ 199.99 - USD');
            formatter.displayOrder = DisplayOrder.SYMBOL_NUMBER_NAME_SIGN;
            expect(formatter.format(money)).toBe('$ 199.99 USD -');
            formatter.displayOrder = DisplayOrder.NAME_SIGN_SYMBOL_NUMBER;
            expect(formatter.format(money)).toBe('USD - $ 199.99');
            formatter.displayOrder = DisplayOrder.NAME_SYMBOL_SIGN_NUMBER;
            expect(formatter.format(money)).toBe('USD $ - 199.99');
            formatter.displayOrder = DisplayOrder.NAME_SIGN_NUMBER_SYMBOL;
            expect(formatter.format(money)).toBe('USD - 199.99 $');
            formatter.displayOrder = DisplayOrder.NAME_SYMBOL_NUMBER_SIGN;
            expect(formatter.format(money)).toBe('USD $ 199.99 -');
            formatter.displayOrder = DisplayOrder.NAME_NUMBER_SIGN_SYMBOL;
            expect(formatter.format(money)).toBe('USD 199.99 - $');
            formatter.displayOrder = DisplayOrder.NAME_NUMBER_SYMBOL_SIGN;
            expect(formatter.format(money)).toBe('USD 199.99 $ -');
            formatter.displayOrder = DisplayOrder.NUMBER_NAME_SYMBOL_SIGN;
            expect(formatter.format(money)).toBe('199.99 USD $ -');
            formatter.displayOrder = DisplayOrder.NUMBER_NAME_SIGN_SYMBOL;
            expect(formatter.format(money)).toBe('199.99 USD - $');
            formatter.displayOrder = DisplayOrder.NUMBER_SIGN_NAME_SYMBOL;
            expect(formatter.format(money)).toBe('199.99 - USD $');
            formatter.displayOrder = DisplayOrder.NUMBER_SIGN_SYMBOL_NAME;
            expect(formatter.format(money)).toBe('199.99 - $ USD');
            formatter.displayOrder = DisplayOrder.NUMBER_SYMBOL_NAME_SIGN;
            expect(formatter.format(money)).toBe('199.99 $ USD -');
            formatter.displayOrder = DisplayOrder.NUMBER_SYMBOL_SIGN_NAME;
            expect(formatter.format(money)).toBe('199.99 $ - USD');

        });

    });
    describe('The constructor', () => {
        let money : Money = new Money('1234567.890');
        it('should allow for initial values to be set', () => {
            let formatter : MoneyFormatter = new MoneyFormatter({
                currencySymbol : '#',
                symbolSeparator : '_',
                currencyName : 'QQQ',
                nameSeparator : '-',
                positiveSign : 'P',
                negativeSign : 'M',
                signSeparator : '|',
                displayOrder : DisplayOrder.SIGN_SYMBOL_NUMBER_NAME,
                digitCharacters : ['A','B','C','D','E','F','G','H','I','J'],
                myriadMode : MyriadMode.JAPANESE,
                myriadCharacters : ['ß','?',';'],
                decimalSeparator : ':',
                groupSeparator : ' ',
                groupSize : 2,
            });
            expect(money.value).toBe('1234567.890');
            expect(formatter.format(money)).toBe('P|#_B CD EF GH:IJA-QQQ');
            money.isNegative = true;
            expect(formatter.format(money)).toBe('M|#_B CD EF GH:IJA-QQQ');
            money.value = '5312';
            expect(formatter.formatMyriad(money)).toBe('P|#_F;D?ßC-QQQ');
            money.value = '5322';
            expect(formatter.formatMyriad(money)).toBe('P|#_F;D?CßC-QQQ');
        });
        it('should reject invalid initializer values', () => {
            expect(() => {
                new MoneyFormatter({
                    groupSize : -1,
                });
            }).toThrowError();
        });
    });
});
