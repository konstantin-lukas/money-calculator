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
            formatter = FormatterFactory.getFormatter(preset.JA_PURE);
            expect(formatter.getFormattedString(money)).toBe('二五一．二五一二円');
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
            money.setValue('100500000');
            expect(formatter.getFormattedMyriadString(money)).toBe('一億五十万円');
            money.setValue('-100500000');
            expect(formatter.getFormattedMyriadString(money)).toBe('－一億五十万円');
            money.setValue('-0');
            expect(formatter.getFormattedMyriadString(money)).toBe('〇円');
        });
        it('should handle the JA_MIXED preset', () => {
            money.setValue('251.2512');
            formatter = FormatterFactory.getFormatter(preset.JA_MIXED);
            expect(formatter.getFormattedString(money)).toBe('２５１．２５１２円');
            expect(() => formatter.getFormattedMyriadString(money)).toThrowError();
            money.setValue('100500000');
            expect(formatter.getFormattedMyriadString(money)).toBe('１億５十万円');
            money.setValue('-100500000');
            expect(formatter.getFormattedMyriadString(money)).toBe('－１億５十万円');
            money.setValue('-0');
            expect(formatter.getFormattedMyriadString(money)).toBe('０円');
        });
        it('should handle the EN_US preset', () => {
            money.setValue('251.2512');
            formatter = FormatterFactory.getFormatter(preset.EN_US);
            expect(formatter.getFormattedString(money)).toBe('$ 251.2512');
            money.setValue('100000000');
            expect(formatter.getFormattedString(money)).toBe('$ 100,000,000');
            money.setValue('-100000000.00');
            expect(formatter.getFormattedString(money)).toBe('$ -100,000,000.00');
            formatter.setGroupSize(0);
            expect(formatter.getFormattedString(money)).toBe('$ -100000000.00');
            money.setValue('-0');
            expect(formatter.getFormattedMyriadString(money)).toBe('$ 0');
        });
    });
});
