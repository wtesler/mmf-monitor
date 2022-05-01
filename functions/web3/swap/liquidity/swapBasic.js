module.exports = async (srcToken, dstToken, srcInBigNumber, wallet) => {
  const swapTokens = require('../swapTokens');
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const ACTION = `SWAP LIQUIDITY`;

  console.log(`${ACTION} | TOKENS: ${srcToken} / ${dstToken}`);

  console.log(`${ACTION} | SWAPPING ${srcInBigNumber.toString()} ${srcToken} for atleast 0 ${dstToken}.`);

  const parameterFunction = async() => {
    const internalTransactions = [
      TokenAddresses[srcToken], TokenAddresses[dstToken]
    ];

    return [srcInBigNumber, '0x0', internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);
};
