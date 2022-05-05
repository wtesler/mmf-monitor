module.exports = async (srcToken, dstToken, srcInBigNumber, wallet) => {
  const swapTokens = require('../swapTokens');
  const readNativePrice = require('../../token/readNativePrice');
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const FixedNumberUtils = require("../../../numbers/FixedNumberUtils");

  const ACTION = `SWAP BASIC`;

  console.log(`${ACTION} | TOKENS: ${srcToken} / ${dstToken}`);

  if (srcInBigNumber.isZero()) {
    console.warn("NO NEED TO SWAP BECAUSE SRC IN AMOUNT WAS ZERO");
    return null;
  }

  let dstOutMinBigNumber;

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

    const dstOutFixedNumber = FixedNumberUtils.AdjustToDecimals(srcToken, dstToken, srcInBigNumber);

    // console.log(`DST OUT FIXED NUMBER: ${dstOutFixedNumber}`);

    const adjustedDstOutFixedNumber = FixedNumberUtils.Multiply(dstOutFixedNumber, priceNativeFixedNumber);

    // console.log(`ADJUSTED DST OUT FIXED NUMBER: ${adjustedDstOutFixedNumber}`);

    const slippage = .995;
    const dstOutMinFixedNumber = FixedNumberUtils.Multiply(adjustedDstOutFixedNumber, slippage);

    // console.log(`DST OUT MIN FIXED NUMBER: ${dstOutMinFixedNumber}`);

    dstOutMinBigNumber = FixedNumberUtils.NumberToBigNumber(dstOutMinFixedNumber);

    console.log(`${ACTION} | Swapping ${srcInBigNumber.toString()} ${srcToken} for atleast ${dstOutMinBigNumber.toString()} ${dstToken}.`);

    // return;

    const internalTransactions = [
      TokenAddresses[srcToken], TokenAddresses[dstToken]
    ];

    return [srcInBigNumber, dstOutMinBigNumber, internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);

  return {
    src: {
      amount: srcInBigNumber.toString(),
      name: srcToken
    },
    dst: {
      amount: dstOutMinBigNumber.toString(),
      name: dstToken
    }
  };
};
