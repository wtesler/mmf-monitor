module.exports = class FormatToken {
  static formatUsdc(num) {
    const {ethers} = require("ethers");
    return ethers.utils.parseUnits(`${num}`, 6);
  }

  static formatCro(num) {
    const {ethers} = require("ethers");
    return ethers.utils.parseUnits(`${num}`, 18);
  }
};
