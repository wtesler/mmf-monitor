module.exports = class FormatToken {
  static formatToken(tokenName, num) {
    const {ethers} = require("ethers");
    const TokenDecimals = require("./TokenDecimals");
    let numStr;
    if (Number.isNaN(num)) {
      numStr = num;
    } else {
      numStr = num.toLocaleString('fullwide', {useGrouping: false, maximumSignificantDigits: 21});
    }
    return ethers.utils.parseUnits(numStr, TokenDecimals[tokenName]);
  }

  static formatUnits(tokenName, bigNumber) {
    const {ethers} = require("ethers");
    const TokenDecimals = require("./TokenDecimals");
    return Number(ethers.utils.formatUnits(bigNumber, TokenDecimals[tokenName]));
  }

  static parseToken(tokenName, bigNumber) {
    const TokenDecimals = require("./TokenDecimals");
    return bigNumber / (Math.pow(10, TokenDecimals[tokenName]));
  }

  static toFixedDecimals(number, decimals) {
    return Math.trunc(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};
