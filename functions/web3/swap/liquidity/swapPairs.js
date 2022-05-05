/**
 * Deprecated not used.
 */
module.exports = async (srcA, srcB, dstA, dstB, wallet) => {
  const readTokenBalance = require('../../token/readTokenBalance');
  const swapTokens = require('../swapTokens');
  const TokenAddresses = require("../../../constants/TokenAddresses");

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

      const srcBigNumber = await readTokenBalance(src, wallet);

      // TODO This could be more strict.
      const dstBigNumberOut = '0x0';

      console.log(`${ACTION} | ${srcBigNumber.toString()} ${src} for atleast ${dstBigNumberOut} ${dst}.`);

      const internalTransactions = [
        srcAddress, dstAddress
      ];

      return [srcBigNumber, dstBigNumberOut, internalTransactions];
    };

    const [formattedIn, formattedOutMin] = await swapTokens(parameterFunction, wallet);

    return {src: {name: src, amount: formattedIn.toString()}, dst: {name: dst, amount: formattedOutMin.toString()}};
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

  let swapAPromise = Promise.resolve(null);
  let swapBPromise = Promise.resolve(null);

  if (!isFinished(srcA)) {
    const srcADst = assignDst();
    swapAPromise = performSwap(srcA, srcADst);
  }

  if (!isFinished(srcB)) {
    const srcBDst = assignDst();
    swapBPromise = performSwap(srcB, srcBDst);
  }

  const [swapASummary, swapBSummary] = await Promise.all([swapAPromise, swapBPromise]);

  console.log(`${ACTION} | SUCCESS`);

  return [swapASummary, swapBSummary];
};
