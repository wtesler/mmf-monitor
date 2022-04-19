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
    const parameterFunction = async() => {
      const srcAddress = TokenAddresses[src];
      const dstAddress = TokenAddresses[dst];

      let srcAmount = await readTokenBalance(src, wallet);

      // TODO Why do we have to decrement a tiny value?
      srcAmount = srcAmount - (Math.pow(10, -6));

      srcAmount = Number(srcAmount.toFixed(TokenDecimals[src])); // Round off the decimal.

      // TODO This could be more strict.
      const dstAmountMin = 0;

      console.log(`${ACTION} | ${srcAmount} ${src} for atleast ${dstAmountMin} ${dst}.`);

      const formattedInAmount = FormatToken.formatToken(src, srcAmount);
      const formattedOutAmountMin = FormatToken.formatToken(dst, dstAmountMin);

      const internalTransactions = [
        srcAddress, dstAddress
      ];

      return [formattedInAmount, formattedOutAmountMin, internalTransactions];
    };

    await swapTokens(parameterFunction, wallet);

    finishedDsts.push(dst);
  };

  const assignDst = () => {
    if (!isFinished(dstA)) {
      finishedDsts.push(dstA);
      return dstA;
    } else if (!isFinished(dstB)) {
      finishedDsts.push(dstB);
      return dstB;
    } else {
      throw new Error("No dst available. There is a problem with the logic.");
    }
  };

  let swapAPromise = Promise.resolve();
  let swapBPromise = Promise.resolve();

  if (!isFinished(srcA)) {
    const srcADst = assignDst();
    swapAPromise = performSwap(srcA, srcADst);
  }

  if (!isFinished(srcB)) {
    const srcBDst = assignDst();
    swapBPromise = performSwap(srcB, srcBDst);
  }

  await Promise.all([swapAPromise, swapBPromise]);

  console.log(`${ACTION} | SUCCESS`);
};
