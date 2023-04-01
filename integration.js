/*
EXAMPLE USING THE REGULAR HTML JAVASCRIPT LOADING METHOD

let money1 = new moneydew.Money('1.00');
console.log(money1.value);
let money2 = new moneydew.Money('1.00');
moneydew.MoneyCalculator.add(money1, money2);
console.log(money2.value);
let formatter = new moneydew.MoneyFormatter({});
console.log(formatter.format(money1));
formatter.displayOrder = moneydew.displayOrder.NUMBER_NAME_SYMBOL_SIGN;
console.log(formatter.format(money1));
*/

/*
EXAMPLE USING THE UMD LOADING METHOD
USE HTTP SERVER OR WEBPACK DEV SERVER TO SERVE HTML FILE

import "./dist/moneydew.umd.js";
let money1 = new Money('1.00');
console.log(money1.value);
let money2 = new Money('1.00');
MoneyCalculator.add(money1, money2);
console.log(money2.value);
let formatter = new MoneyFormatter({});
console.log(formatter.format(money1));
formatter.displayOrder = displayOrder.NUMBER_NAME_SYMBOL_SIGN;
console.log(formatter.format(money1));
*/

/*
EXAMPLE USING THE COMMONJS LOADING METHODS
USE NPM TO RUN FILE

import myLibrary from "./dist/moneydew.commonjs.cjs";
let money1 = new myLibrary.Money('1.00');
console.log(money1.value);
let money2 = new myLibrary.Money('1.00');
myLibrary.MoneyCalculator.add(money1, money2);
console.log(money2.value);
let formatter = new myLibrary.MoneyFormatter({});
console.log(formatter.format(money1));
formatter.displayOrder = myLibrary.displayOrder.NUMBER_NAME_SYMBOL_SIGN;
console.log(formatter.format(money1));
*/
