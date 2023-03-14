import {MoneyFormatter, myriadMode, symbolPosition} from "./money_formatter";

export enum preset {
    EN_US,
    DE,
    JA_PURE,
    JA_MIXED,
    KO,
    ES,
    FR
}
export class FormatterFactory {
    public static getFormatter(presetToUse : preset) : MoneyFormatter {
        let formatter : MoneyFormatter = new MoneyFormatter();
        switch (presetToUse) {
            case preset.JA_PURE:
                formatter.setMyriadMode(myriadMode.JAPANESE);
                formatter.setDigitCharacters(['〇','一','二','三','四','五','六','七','八','九']);
                formatter.setMyriadCharacters(['十','百','千','万','億','兆','京','垓','𥝱','穣','溝','澗','正','載',]);
                formatter.setSymbolPosition(symbolPosition.BACK);
                formatter.setSymbolSeparator('');
                formatter.setCurrencySymbol('円');
                formatter.setNegativeSign('－');
                formatter.setPositiveSign('');
                formatter.setDecimalSeparator('．');
                formatter.setGroupSeparator('');
                formatter.setGroupSize(0);
                break;
            case preset.JA_MIXED:
                formatter.setMyriadMode(myriadMode.JAPANESE);
                formatter.setDigitCharacters(['０','１','２','３','４','５','６','７','８','９']);
                formatter.setMyriadCharacters(['十','百','千','万','億','兆','京','垓','𥝱','穣','溝','澗','正','載',]);
                formatter.setSymbolPosition(symbolPosition.BACK);
                formatter.setSymbolSeparator('');
                formatter.setCurrencySymbol('円');
                formatter.setNegativeSign('－');
                formatter.setPositiveSign('');
                formatter.setDecimalSeparator('．');
                formatter.setGroupSeparator('');
                formatter.setGroupSize(0);
                break;
            case preset.EN_US:
                formatter.setDigitCharacters(['0','1','2','3','4','5','6','7','8','9']);
                formatter.setSymbolPosition(symbolPosition.FRONT);
                formatter.setSymbolSeparator(' ');
                formatter.setCurrencySymbol('$');
                formatter.setNegativeSign('-');
                formatter.setPositiveSign('');
                formatter.setDecimalSeparator('.');
                formatter.setGroupSeparator(',');
                formatter.setGroupSize(3);
                break;
            default:
                throw new Error('Provided preset is not supported');
        }
        return formatter;
    }
}
