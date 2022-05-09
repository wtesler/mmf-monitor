/**
 * @deprecated Not in use.
 *
 * Checks if the conditions are necessary to issue a buy/sell swap and make the swap if necessary.
 *
 * @param config The arbitrage config pulled from the database.
 * @param sharedObj You can see fields of this object in `arbitrageLoop`. They are values shared across body calls.
 * @param wallet
 */
module.exports = async (config, sharedObj, wallet) => {
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const readNativePrice = require('../../web3/token/readNativePrice');
  const swapFast = require('../../web3/swap/liquidity/swapFast');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenNames = require('../../constants/TokenNames');
  const TokenDecimals = require('../../constants/TokenDecimals');
  const {BigNumber} = require('ethers');

  const ACTION = `ARBITRAGE`;

  if (sharedObj.isSwapping) {
    return;
  }

  if (sharedObj.isFetchingTokenBalances) {
    return;
  }

  sharedObj.numBodies += 1;

  let localIsFetchingTokenBalances = false;
  let localIsSwapping = false;

  try {
    const {email, pairToken, sellThreshold, buyThreshold, slippage, crossoverMult, maxSrcNumber} = config;

    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

    const tokenADecimalMult = BigNumber.from(10).pow(TokenDecimals[tokenA]);
    const tokenBDecimalMult = BigNumber.from(10).pow(TokenDecimals[tokenB]);

    // Adjust maxSrcNumber from config to the respective decimal places.
    let maxSrcAmountBigNumberA = BigNumber.from(maxSrcNumber).mul(tokenADecimalMult);
    let maxSrcAmountBigNumberB = BigNumber.from(maxSrcNumber).mul(tokenBDecimalMult);

    if (sharedObj.doesNeedToFetchTokenBalances) {
      localIsFetchingTokenBalances = true;
      sharedObj.isFetchingTokenBalances = true;

      const balances = await Promise.all([
        readTokenBalance(tokenA, wallet, false),
        readTokenBalance(tokenB, wallet, false),
      ]);

      sharedObj.tokenABalanceBigNumber = balances[0];
      sharedObj.tokenBBalanceBigNumber = balances[1];

      const tokenABalanceStr = sharedObj.tokenABalanceBigNumber.toString();
      const tokenBBalanceStr = sharedObj.tokenBBalanceBigNumber.toString();

      console.log(`${tokenA} BALANCE: ${tokenABalanceStr}`);
      console.log(`${tokenB} BALANCE: ${tokenBBalanceStr}`);

      if (sharedObj.didJustSuccessfullySwap) {
        sharedObj.didJustSuccessfullySwap = false;

        const tokenABalanceFixed = FixedNumberUtils.From(sharedObj.tokenABalanceBigNumber);
        const tokenBBalanceFixed = FixedNumberUtils.From(sharedObj.tokenBBalanceBigNumber);
        const adjustedTokenAFixed = FixedNumberUtils.Divide(tokenABalanceFixed, tokenADecimalMult);
        const adjustedTokenBFixed = FixedNumberUtils.Divide(tokenBBalanceFixed, tokenBDecimalMult);
        const totalBalanceUsd = adjustedTokenAFixed.addUnsafe(adjustedTokenBFixed);

        // noinspection ES6MissingAwait
        sendInBlueClient.sendEmail(email, 11, {
          tokenA: tokenA,
          tokenB: tokenB,
          tokenABalance: tokenABalanceStr,
          tokenBBalance: tokenBBalanceStr,
          totalBalanceUsd: totalBalanceUsd,
        });
      }

      localIsFetchingTokenBalances = false;
      sharedObj.isFetchingTokenBalances = false;
      sharedObj.doesNeedToFetchTokenBalances = false;
    }

    const priceNativeFixedNumber = await readNativePrice(pairToken, wallet);

    const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();
    const priceStr = priceNativeFloat.toFixed(6);

    if (priceStr !== sharedObj.lastPriceStr) {
      console.log(`${ACTION} | PRICE: ${priceStr}`);
      sharedObj.lastPriceStr = priceStr;
    }

    let srcToken;
    let dstToken;
    let srcAmountBigNumber;
    let decision = 'NONE';

    let dstPriceFixedNumber;

    const adjustMaxSrcAmountToThresholdDiff = (priceFloat, threshold, maxSrcAmountBigNumber) => {
      const maxSrcAmountFixed = FixedNumberUtils.From(maxSrcAmountBigNumber);
      const thresholdPriceDiff = Math.abs(priceFloat - threshold);
      const thresholdPriceDiffMult = Math.max(thresholdPriceDiff * crossoverMult, 1);
      const adjustedMaxSrcAmountFixed = FixedNumberUtils.Multiply(maxSrcAmountFixed, thresholdPriceDiffMult);
      const adjustedMaxSrcAmountBigNumber = FixedNumberUtils.NumberToBigNumber(adjustedMaxSrcAmountFixed);
      return adjustedMaxSrcAmountBigNumber;
    };

    let srcAmountBigNumberA = sharedObj.tokenABalanceBigNumber;
    let srcAmountBigNumberB = sharedObj.tokenBBalanceBigNumber;

    if (priceNativeFloat > sellThreshold) {
      decision = 'SELL';

      srcToken = tokenA;
      dstToken = tokenB;

      maxSrcAmountBigNumberA = adjustMaxSrcAmountToThresholdDiff(priceNativeFloat, sellThreshold, maxSrcAmountBigNumberA);

      if (srcAmountBigNumberA.gt(maxSrcAmountBigNumberA)) {
        srcAmountBigNumberA = maxSrcAmountBigNumberA;
      }

      srcAmountBigNumber = srcAmountBigNumberA;
      dstPriceFixedNumber = FixedNumberUtils.From(sellThreshold);
    } else if (priceNativeFloat < buyThreshold) {
      decision = 'BUY';

      srcToken = tokenB;
      dstToken = tokenA;

      maxSrcAmountBigNumberB = adjustMaxSrcAmountToThresholdDiff(priceNativeFloat, buyThreshold, maxSrcAmountBigNumberB);

      if (srcAmountBigNumberB.gt(maxSrcAmountBigNumberB)) {
        srcAmountBigNumberB = maxSrcAmountBigNumberB;
      }

      srcAmountBigNumber = srcAmountBigNumberB;
      dstPriceFixedNumber = FixedNumberUtils.From(buyThreshold);
      dstPriceFixedNumber = FixedNumberUtils.Divide(1, dstPriceFixedNumber);
    }

    if (srcToken && !srcAmountBigNumber.isZero() && !sharedObj.isSwapping) {
      await sharedObj.swapMutex.runExclusive(async () => {
        sharedObj.isSwapping = true;
        localIsSwapping = true;

        console.log(`${ACTION} | ${decision}`);

        // noinspection ES6MissingAwait
        sendInBlueClient.sendEmail(email, 10, {
          decision: decision,
          price: priceStr
        });

        await swapFast(srcToken, dstToken, srcAmountBigNumber, dstPriceFixedNumber, slippage, wallet);

        sharedObj.didJustSuccessfullySwap = true;
        sharedObj.isSwapping = false;
        localIsSwapping = false;

        sharedObj.doesNeedToFetchTokenBalances = true;
      });
    }
  } catch (e) {
    const errStr = e.toString();
    if (errStr.includes('502 Bad Gateway') || errStr.includes('504 Bad Gateway')) {
      console.warn('Bad Gateway.');
    } else {
      console.error(e);
    }
    if (localIsFetchingTokenBalances) {
      sharedObj.isFetchingTokenBalances = false;
    }
    if (localIsSwapping) {
      sharedObj.isSwapping = false;
    }
    sharedObj.doesNeedToFetchTokenBalances = true;
  } finally {
    sharedObj.numBodies -= 1;
  }
};
