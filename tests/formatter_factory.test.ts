import {Money} from "../src/money";
import {MoneyFormatter} from "../src/money_formatter";
import {FormatterFactory, preset} from "../src/formatter_factory";

describe('Money class', () => {
    let money = new Money('251.2512');
    let formatter : MoneyFormatter;
    describe('The getFormattedString', () => {
        it('should reject presets that are not implemented', () => {
            expect(() => formatter = FormatterFactory.getFormatter(-1)).toThrowError();
        });
        it('should handle the JA_PURE preset', () => {
            formatter = FormatterFactory.getFormatter(preset.JPY_PURE);
            expect(formatter.format(money)).toBe('二五一．二五一二円');
            expect(() => formatter.formatMyriad(money)).toThrowError();
            money.value = '100500000';
            expect(formatter.formatMyriad(money)).toBe('一億五十万円');
            money.value = '-100500000';
            expect(formatter.formatMyriad(money)).toBe('－一億五十万円');
            money.value = '-0';
            expect(formatter.formatMyriad(money)).toBe('〇円');
        });
        it('should handle the JA_MIXED preset', () => {
            money.value = '251.2512';
            formatter = FormatterFactory.getFormatter(preset.JPY_MIXED);
            expect(formatter.format(money)).toBe('２５１．２５１２円');
            expect(() => formatter.formatMyriad(money)).toThrowError();
            money.value = '100500000';
            expect(formatter.formatMyriad(money)).toBe('１億５十万円');
            money.value = '-100500000';
            expect(formatter.formatMyriad(money)).toBe('－１億５十万円');
            money.value = '-0';
            expect(formatter.formatMyriad(money)).toBe('０円');
        });
        it('should handle the EN_US preset', () => {
            money.value = '251.2512';
            formatter = FormatterFactory.getFormatter(preset.EN_US);
            expect(formatter.format(money)).toBe('$251.2512');
            money.value = '100000000';
            expect(formatter.format(money)).toBe('$100,000,000');
            money.value = '-100000000.00';
            expect(formatter.format(money)).toBe('($100,000,000.00)');
            formatter.groupSize = 0;
            expect(formatter.format(money)).toBe('($100000000.00)');
            money.value = '-0';
            expect(formatter.formatMyriad(money)).toBe('$0');
        });
        it('should handle the EUR preset', () => {
            money.value = '251.2512';
            formatter = FormatterFactory.getFormatter(preset.EUR);
            expect(formatter.format(money)).toBe('251,2512 €');
            money.value = '100000000';
            expect(formatter.format(money)).toBe('100.000.000 €');
            money.value = '-100000000.00';
            expect(formatter.format(money)).toBe('-100.000.000,00 €');
            formatter.groupSize = 0;
            expect(formatter.format(money)).toBe('-100000000,00 €');
            money.value = '-0';
            expect(formatter.formatMyriad(money)).toBe('0 €');
        });
    });
});
