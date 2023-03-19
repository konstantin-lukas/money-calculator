import {MoneyFormatter, myriadMode, signDisplayMode, symbolPosition} from "./money_formatter";

export enum preset {
    EN_US,
    DE,
    JPY_PURE,
    JPY_MIXED,
    JPY_INTL,
    KO,
    EUR
}
export class FormatterFactory {
    public static getFormatter(presetToUse : preset) : MoneyFormatter {
        let formatter : MoneyFormatter = new MoneyFormatter();
        switch (presetToUse) {
            case preset.JPY_PURE:
                formatter.myriadMode = myriadMode.JAPANESE;
                formatter.digitCharacters = ['〇','一','二','三','四','五','六','七','八','九'];
                formatter.myriadCharacters = ['十','百','千','万','億','兆','京','垓','𥝱','穣','溝','澗','正','載',];
                formatter.symbolPosition = symbolPosition.BACK;
                formatter.symbolSeparator = '';
                formatter.currencySymbol = '円';
                formatter.negativeSign = '－';
                formatter.positiveSign = '';
                formatter.decimalSeparator = '．';
                formatter.groupSeparator = '';
                formatter.groupSize = 0;
                break;
            case preset.JPY_MIXED:
                formatter.myriadMode = myriadMode.JAPANESE;
                formatter.digitCharacters = ['０','１','２','３','４','５','６','７','８','９'];
                formatter.myriadCharacters = ['十','百','千','万','億','兆','京','垓','𥝱','穣','溝','澗','正','載',];
                formatter.symbolPosition = symbolPosition.BACK;
                formatter.symbolSeparator = '';
                formatter.currencySymbol = '円';
                formatter.negativeSign = '－';
                formatter.positiveSign = '';
                formatter.decimalSeparator = '．';
                formatter.groupSeparator = '';
                formatter.groupSize = 0;
                break;
            case preset.EN_US:
                formatter.digitCharacters = ['0','1','2','3','4','5','6','7','8','9'];
                formatter.symbolPosition = symbolPosition.FRONT;
                formatter.symbolSeparator = '';
                formatter.currencySymbol = '$';
                formatter.negativeSign = '-';
                formatter.positiveSign = '';
                formatter.decimalSeparator = '.';
                formatter.groupSeparator = ',';
                formatter.groupSize = 3;
                formatter.signDisplayMode = signDisplayMode.PARENTHESES;
                formatter.openingParenthesis = '(';
                formatter.closingParenthesis = ')';
                break;
            case preset.EUR:
                formatter.digitCharacters = ['0','1','2','3','4','5','6','7','8','9'];
                formatter.symbolPosition = symbolPosition.BACK;
                formatter.symbolSeparator = ' ';
                formatter.currencySymbol = '€';
                formatter.negativeSign = '-';
                formatter.positiveSign = '';
                formatter.decimalSeparator = ',';
                formatter.groupSeparator = '.';
                formatter.groupSize = 3;
                formatter.signDisplayMode = signDisplayMode.BEFORE;
                formatter.openingParenthesis = '(';
                formatter.closingParenthesis = ')';
                break;

            // TEMPLATE CONTAINING ALL SETTERS
            /*case preset.:
                formatter.setSignSeparator('');
                formatter.setOpeningParenthesis('(');
                formatter.setClosingParenthesis(')');
                formatter.setSymbolPosition(symbolPosition.FRONT);
                formatter.setSignDisplayMode(signDisplayMode.BEFORE);
                formatter.setGroupSeparator(',');
                formatter.setGroupSize(3);
                formatter.setDecimalSeparator('.');
                formatter.setNegativeSign('-');
                formatter.setPositiveSign('');
                formatter.setCurrencySymbol('$');
                formatter.setMyriadCharacters(['十','百','千','万','億','兆','京','垓','𥝱','穣','溝','澗','正','載',]);
                formatter.setMyriadMode(myriadMode.JAPANESE);
                formatter.setSymbolSeparator(' ');
                formatter.setDigitCharacters(['0','1','2','3','4','5','6','7','8','9']);
                break;*/
            default:
                throw new Error('Provided preset is not supported');
        }
        return formatter;
    }
}
