import moneycalc from "../dist/money_calculator.commonjs.cjs";

let moneyValue = new moneycalc.Money(251.2512);

if (moneyValue.getValue() === '251.2512') {
    console.log('PASSED: TEST CASE 1');
} else {
    console.log('FAILED: TEST CASE 1');
}

moneyValue.setValue(-124);

if (moneyValue.getValue() === '-124') {
    console.log('PASSED: TEST CASE 2');
} else {
    console.log('FAILED: TEST CASE 2');
}
