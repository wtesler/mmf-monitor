(async () => {
  const {BigNumber, FixedNumber} = require('ethers');
  const TokenNames = require('../../constants/TokenNames');

  const FixedNumberUtils = require("../FixedNumberUtils");

  const response = FixedNumberUtils.NumberToBigNumber('36705028177096034347');

  console.log(response.toString());
})();
