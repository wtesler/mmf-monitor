module.exports = async (srcToken, dstToken, srcBigNumber, wallet, slippage=.995) => {
  const swapTokens = require('../swapTokens');
  const readNativePrice = require('../../token/readNativePrice');
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const FixedNumberUtils = require("../../../numbers/FixedNumberUtils");

  const ACTION = `SWAP BASIC`;

  console.log(`${ACTION} | TOKENS: ${srcToken} -> ${dstToken}`);

  if (srcBigNumber.isZero()) {
    console.warn("NO NEED TO SWAP BECAUSE SRC AMOUNT WAS ZERO");
    return null;
  }

  let dstMinBigNumber;

  const parameterFunction = async () => {
    let pairTokenName = `${srcToken}_${dstToken}`;
    let didFlipPair = false;
    const address = TokenAddresses[pairTokenName];
    if (!address) {
      pairTokenName = `${dstToken}_${srcToken}`;
      didFlipPair = true;
    }

    let priceNativeFixedNumber = await readNativePrice(pairTokenName, wallet);

    if (didFlipPair) {
      priceNativeFixedNumber = FixedNumberUtils.Divide(1, priceNativeFixedNumber);
    }

    const dstOutFixedNumber = FixedNumberUtils.AdjustToDecimals(srcToken, dstToken, srcBigNumber);

    // console.log(`DST OUT FIXED NUMBER: ${dstOutFixedNumber}`);

    const adjustedDstOutFixedNumber = FixedNumberUtils.Multiply(dstOutFixedNumber, priceNativeFixedNumber);

    // console.log(`ADJUSTED DST OUT FIXED NUMBER: ${adjustedDstOutFixedNumber}`);

    const dstOutMinFixedNumber = FixedNumberUtils.Multiply(adjustedDstOutFixedNumber, slippage);

    // console.log(`DST OUT MIN FIXED NUMBER: ${dstOutMinFixedNumber}`);

    dstMinBigNumber = FixedNumberUtils.NumberToBigNumber(dstOutMinFixedNumber);

    console.log(`${ACTION} | Swapping ${srcBigNumber.toString()} ${srcToken} for atleast ${dstMinBigNumber.toString()} ${dstToken}.`);

    // return;

    const internalTransactions = [
      TokenAddresses[srcToken], TokenAddresses[dstToken]
    ];

    return [srcBigNumber, dstMinBigNumber, internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);

  return {
    src: {
      amount: srcBigNumber.toString(),
      name: srcToken
    },
    dst: {
      amount: dstMinBigNumber.toString(),
      name: dstToken
    }
  };
};
