module.exports = async (config, mutexObj, wallet) => {
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const readNativePrice = require('../../web3/token/readNativePrice');
  const swapFast = require('../../web3/swap/liquidity/swapFast');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenNames = require('../../constants/TokenNames');

  const ACTION = `ARBITRAGE`;

  if (mutexObj.isSwapping) {
    return;
  }

  if (mutexObj.isFetchingTokenBalances) {
    return;
  }

  mutexObj.numBodies += 1;

  let localIsFetchingTokenBalances = false;
  let localIsSwapping = false;

  try {
    const {email, pairToken, sellThreshold, buyThreshold, slippage} = config;

    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

    if (mutexObj.doesNeedToFetchTokenBalances) {
      localIsFetchingTokenBalances = true;
      mutexObj.isFetchingTokenBalances = true;
      const balances = await Promise.all([
        readTokenBalance(tokenA, wallet, false),
        readTokenBalance(tokenB, wallet, false),
      ]);
      localIsFetchingTokenBalances = false;
      mutexObj.isFetchingTokenBalances = false;
      mutexObj.doesNeedToFetchTokenBalances = false;

      mutexObj.tokenABalanceBigNumber = balances[0];
      mutexObj.tokenBBalanceBigNumber = balances[1];

      console.log(`${tokenA} BALANCE: ${mutexObj.tokenABalanceBigNumber.toString()}`);
      console.log(`${tokenB} BALANCE: ${mutexObj.tokenBBalanceBigNumber.toString()}`);
    }

    let priceNativeFixedNumber = await readNativePrice(pairToken, wallet);

    const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();
    const priceStr = priceNativeFloat.toFixed(6);

    if (priceStr !== mutexObj.lastPriceStr) {
      console.log(`${ACTION} | PRICE: ${priceStr}`);
      mutexObj.lastPriceStr = priceStr;
    }

    let srcToken;
    let dstToken;
    let srcAmountBigNumber;
    let decision = 'NONE';

    let dstPriceFixedNumber;

    if (priceNativeFloat > sellThreshold) {
      srcToken = tokenA;
      dstToken = tokenB;
      srcAmountBigNumber = mutexObj.tokenABalanceBigNumber;
      dstPriceFixedNumber = FixedNumberUtils.From(sellThreshold);
      decision = 'SELL';
    } else if (priceNativeFloat < buyThreshold) {
      srcToken = tokenB;
      dstToken = tokenA;
      srcAmountBigNumber = mutexObj.tokenBBalanceBigNumber;
      dstPriceFixedNumber = FixedNumberUtils.From(buyThreshold);
      dstPriceFixedNumber = FixedNumberUtils.Divide(1, dstPriceFixedNumber);
      decision = 'BUY';
    }

    if (srcToken && !srcAmountBigNumber.isZero() && !mutexObj.isSwapping) {
      mutexObj.isSwapping = true;
      localIsSwapping = true;

      console.log(`${ACTION} | ${decision}`);

      // noinspection ES6MissingAwait
      sendInBlueClient.sendEmail(email, 10, {
        decision: decision,
        price: priceStr
      });

      await swapFast(srcToken, dstToken, srcAmountBigNumber, dstPriceFixedNumber, slippage, wallet);

      mutexObj.isSwapping = false;
      localIsSwapping = false;

      // await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep / Settle

      mutexObj.doesNeedToFetchTokenBalances = true;
    }
  } catch (e) {
    if (e.toString().includes('502 Bad Gateway')) {
      console.warn('Bad Gateway.');
    } else {
      console.error(e);
    }
    if (localIsFetchingTokenBalances) {
      mutexObj.isFetchingTokenBalances = false;
    }
    if (localIsSwapping) {
      mutexObj.isSwapping = false;
    }
    mutexObj.doesNeedToFetchTokenBalances = true;
  } finally {
    mutexObj.numBodies -= 1;
  }
};
