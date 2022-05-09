/**
 * Checks if the conditions are good to issue a buy/sell swap and make the swap if it seems good.
 */
module.exports = (token1, token2, priceFloat, srcAmount, maxSrcNumber, threshold, crossoverMult, baseSlippage, invertDstAmount) => {
  const {BigNumber} = require('ethers');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenDecimals = require('../../constants/TokenDecimals');

  // The base maxSrcAmount provided by the config. We normalize it.
  const tokenDecimalMult = BigNumber.from(10).pow(TokenDecimals[token1]);
  let maxSrcAmount = BigNumber.from(maxSrcNumber).mul(tokenDecimalMult);

  // Adjust maxSrcAmount based on how far we crossed over the threshold.
  // const maxSrcAmountFixed = FixedNumberUtils.From(maxSrcAmount);
  // const thresholdPriceDiff = Math.abs(priceFloat - threshold);
  // const thresholdPriceDiffMult = Math.max(thresholdPriceDiff * crossoverMult, 1);
  //
  // const adjustedMaxSrcAmountFixed = FixedNumberUtils.Multiply(maxSrcAmountFixed, thresholdPriceDiffMult);
  // maxSrcAmount = FixedNumberUtils.NumberToBigNumber(adjustedMaxSrcAmountFixed);
  //
  // const newSlippage = baseSlippage - thresholdPriceDiff;
  const newSlippage = baseSlippage;

  if (srcAmount.gt(maxSrcAmount)) {
    srcAmount = maxSrcAmount;
  }

  let dstPriceFixed = FixedNumberUtils.From(threshold);

  if (invertDstAmount) {
    dstPriceFixed = FixedNumberUtils.Divide(1, dstPriceFixed);
  }

  return [srcAmount, dstPriceFixed, newSlippage];
};
