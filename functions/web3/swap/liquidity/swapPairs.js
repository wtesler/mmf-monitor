module.exports = async (srcA, srcB, dstA, dstB, wallet) => {
  const readTokenBalance = require('../../token/readTokenBalance');
  const swapTokens = require('../swapTokens');
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const TokenDecimals = require("../../../constants/TokenDecimals");
  const FormatToken = require("../../../constants/FormatToken");

  const ACTION = `SWAPPING PAIRS`;

  console.log(`${ACTION} | TOKENS: ${srcA}_${srcB} -> ${dstA}_${dstB}`);

  const finishedDsts = [];

  // Check if the dst pair shares a token with the src pair. For example, USDC in USDC/USDT -> MMF/USDC.
  const checkForFinishedSwaps = src => {
    if (src === dstA) {
      console.log(`${ACTION} | ${src} ALREADY IN DST`);
      finishedDsts.push(dstA);
    }
    if (src === dstB) {
      console.log(`${ACTION} | ${src} ALREADY IN DST`);
      finishedDsts.push(dstB);
    }
  };

  checkForFinishedSwaps(srcA);
  checkForFinishedSwaps(srcB);

  const isFinished = token => {
    return finishedDsts.includes(token);
  };

  const performSwap = async(src, dst) => {
    const srcAddress = TokenAddresses[src];
    const dstAddress = TokenAddresses[dst];

    let srcAmount = await readTokenBalance(src, wallet);

    console.log(srcAmount);

    // TODO Why do we have to decrement a tiny value?
    srcAmount = srcAmount - (Math.pow(10, -TokenDecimals[src]));

    srcAmount = Number(srcAmount.toFixed(TokenDecimals[src])); // Round off the decimal.

    console.log(srcAmount);

    // TODO This could be more strict.
    const dstAmountMin = 0;

    console.log(`${ACTION} | ${srcAmount} ${src} for atleast ${dstAmountMin} ${dst}.`);

    const formattedInAmount = FormatToken.formatToken(src, srcAmount);
    const formattedOutAmountMin = FormatToken.formatToken(dst, dstAmountMin);

    const internalTransactions = [
      srcAddress, dstAddress
    ];

    await swapTokens(formattedInAmount, formattedOutAmountMin, internalTransactions, wallet);

    finishedDsts.push(dst);
  };

  const swapProperDst = async (src) => {
    if (!isFinished(dstA)) {
      await performSwap(src, dstA);
    } else if (!isFinished(dstB)) {
      await performSwap(src, dstB);
    }
  };

  await swapProperDst(srcA);
  await swapProperDst(srcB);
};
