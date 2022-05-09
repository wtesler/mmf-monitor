/**
 * Checks if the conditions are good to issue a buy/sell swap and make the swap if it seems good.
 */
module.exports = (priceFloat, balanceA, balanceB, wallet, config, onSwapResult, nonce, sendInBlueClient) => {
  const performArbitrageSwap = require('./performArbitrageSwap');
  const computeSrcAndDstValues = require('./computeSrcAndDstValues');
  const TokenNames = require('../../constants/TokenNames');

  const ACTION = `ARBITRAGE`;

  let {email, pairToken, sellThreshold, buyThreshold, baseSlippage, crossoverMult, maxSrcNumber} = config;

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const priceStr = priceFloat.toFixed(6);

  let decision = 'NONE';
  let srcToken;
  let dstToken;
  let srcAmount;
  let dstPriceFixed;
  let slippage;
  let isSwapping = false;

  if (priceFloat > sellThreshold) {
    decision = 'SELL';
    srcToken = tokenA;
    dstToken = tokenB;
    [srcAmount, dstPriceFixed, slippage] = computeSrcAndDstValues(srcToken, dstToken, priceFloat, balanceA, maxSrcNumber, sellThreshold, crossoverMult, baseSlippage, false);
  } else if (priceFloat < buyThreshold) {
    decision = 'BUY';
    srcToken = tokenB;
    dstToken = tokenA;
    [srcAmount, dstPriceFixed, slippage] = computeSrcAndDstValues(srcToken, dstToken, priceFloat, balanceB, maxSrcNumber, buyThreshold, crossoverMult, baseSlippage, true);
  }

  if (srcToken && !srcAmount.isZero()) {
    console.log(`${ACTION} | ${decision}`);

    // noinspection ES6MissingAwait
    sendInBlueClient.sendEmail(email, 10, {
      pairToken: pairToken,
      decision: decision,
      price: priceStr
    });

    // noinspection JSIgnoredPromiseFromCall
    performArbitrageSwap(srcToken, dstToken, srcAmount, dstPriceFixed, slippage, wallet, nonce, onSwapResult);

    isSwapping = true;
  }

  return isSwapping;
};
