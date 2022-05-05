module.exports = class TokenAddresses {

  static Multiply(someNumberA, someNumberB) {
    const {FixedNumber} = require('ethers');

    const aString = this._FullNumberString(someNumberA);
    const bString = this._FullNumberString(someNumberB);

    const fixedNumberA = FixedNumber.fromString(aString, this._FixedFormat);
    const fixedNumberB = FixedNumber.fromString(bString, this._FixedFormat);

    return fixedNumberA.mulUnsafe(fixedNumberB);
  }

  static Divide(someNumberA, someNumberB) {
    const {FixedNumber} = require('ethers');

    const aString = this._FullNumberString(someNumberA);
    const bString = this._FullNumberString(someNumberB);

    const fixedNumberA = FixedNumber.fromString(aString, this._FixedFormat);
    const fixedNumberB = FixedNumber.fromString(bString, this._FixedFormat);

    return fixedNumberA.divUnsafe(fixedNumberB);
  }

  static AdjustToDecimals(tokenA, tokenB, someNumberOfTokenA) {
    const {FixedNumber} = require('ethers');
    const TokenDecimals = require('../constants/TokenDecimals');

    const fixedNumberA = FixedNumber.fromString(someNumberOfTokenA.toString(), this._FixedFormat);

    const decimalAdjustment = Math.pow(10, TokenDecimals[tokenB]) / Math.pow(10, TokenDecimals[tokenA]);
    const decimalAdjustmentStr = this._FullNumberString(decimalAdjustment);
    const decimalAdjustmentFixedNumber = FixedNumber.fromString(decimalAdjustmentStr, this._FixedFormat);

    const adjustedNumberA = fixedNumberA.mulUnsafe(decimalAdjustmentFixedNumber);

    return adjustedNumberA;
  }

  static NumberToBigNumber(number) {
    const {BigNumber} = require('ethers');
    const numberStr = this._FullNumberString(number);
    const intStr = numberStr.split('.')[0];
    return BigNumber.from(intStr);
  }

  static _FullNumberString(number) {
    if (Number.isNaN(number)) {
      return number.toString();
    } else {
      return number.toLocaleString('fullwide', {useGrouping: false, maximumSignificantDigits: 21});
    }
  }

  static get _FixedFormat() {
    return {
      signed: true,
      width: 256,
      decimals: 32,
      name: 'large_decimal'
    };
  }
};
