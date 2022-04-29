module.exports = async (srcToken, dstToken, srcSwapBigNumber, wallet) => {
  const swapTokens = require('../swapTokens');
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const ACTION = `SWAP HALF LIQUIDITY`;

  const parameterFunction = async() => {
    console.log(`${ACTION} | TOKENS: ${srcToken} / ${dstToken}`);

    console.log(`${ACTION} | SWAPPING ${srcSwapBigNumber.toString()} ${srcToken} for atleast 0 ${dstToken}.`);

    const internalTransactions = [
      TokenAddresses[srcToken], TokenAddresses[dstToken]
    ];

    return [srcSwapBigNumber, '0x0', internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);
};
