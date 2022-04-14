module.exports = class FormatToken {
  static formatToken(tokenName, num) {
    const {ethers} = require("ethers");
    const TokenDecimals = require("./TokenDecimals");
    return ethers.utils.parseUnits(`${num}`, TokenDecimals[tokenName]);
  }

  static parseToken(tokenName, value) {
    const TokenDecimals = require("./TokenDecimals");
    return value / (Math.pow(10, TokenDecimals[tokenName]));
  }
};
