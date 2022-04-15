module.exports = class FormatToken {
  static formatToken(tokenName, num) {
    const {ethers} = require("ethers");
    const TokenDecimals = require("./TokenDecimals");
    let numStr;
    if (Number.isNaN(num)) {
      numStr = num;
    } else {
      numStr = num.toLocaleString('fullwide', { useGrouping: false, maximumSignificantDigits:21});
    }
    return ethers.utils.parseUnits(numStr, TokenDecimals[tokenName]);
  }

  static parseToken(tokenName, value) {
    const TokenDecimals = require("./TokenDecimals");
    return value / (Math.pow(10, TokenDecimals[tokenName]));
  }
};
