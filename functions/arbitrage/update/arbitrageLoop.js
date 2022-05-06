module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const readNativePrice = require('../../web3/token/readNativePrice');
  const swapStable = require('../../web3/swap/liquidity/swapStable');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const dexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenNames = require('../../constants/TokenNames');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  const firestore = firebaseAdmin.firestore();
  const response = await firestore.doc(`arbitrage/config`).get();
  if (!response.exists) {
    throw new Error('No arbitrage config found.');
  }
  const config = response.data();

  const {email, mnemonic, pairToken, sellThreshold, buyThreshold, slippage} = config;

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const wallet = await prepareWallet(mnemonic);

  let tokenABalanceBigNumber = null;
  let tokenBBalanceBigNumber = null;
  let doesNeedToFetchTokenBalances = true;

  let lastPriceStr = null;

  while (true) {
    try {
      if (doesNeedToFetchTokenBalances) {
        const balances = await Promise.all([
          readTokenBalance(tokenA, wallet, false),
          readTokenBalance(tokenB, wallet, false),
        ]);
        tokenABalanceBigNumber = balances[0];
        tokenBBalanceBigNumber = balances[1];
        console.log(`${tokenA} BALANCE: ${tokenABalanceBigNumber.toString()}`);
        console.log(`${tokenB} BALANCE: ${tokenBBalanceBigNumber.toString()}`);
        doesNeedToFetchTokenBalances = false;
      }

      let priceNativeFixedNumber = await readNativePrice(pairToken, wallet);

      const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();
      const priceStr = priceNativeFloat.toFixed(6);

      if (priceStr !== lastPriceStr) {
        console.log(`${ACTION} | PRICE: ${priceStr}`);
        lastPriceStr = priceStr;
      }

      let srcToken;
      let dstToken;
      let srcAmountBigNumber;
      let decision = 'NONE';

      if (priceNativeFloat > sellThreshold) {
        srcToken = tokenA;
        dstToken = tokenB;
        srcAmountBigNumber = tokenABalanceBigNumber;
        decision = 'SELL';
      } else if (priceNativeFloat < buyThreshold) {
        srcToken = tokenB;
        dstToken = tokenA;
        srcAmountBigNumber = tokenBBalanceBigNumber;
        priceNativeFixedNumber = FixedNumberUtils.Divide(1, priceNativeFixedNumber);
        decision = 'BUY';
      }

      if (srcToken && !srcAmountBigNumber.isZero()) {
        console.log(`${ACTION} | ${decision}`);

        // noinspection ES6MissingAwait
        sendInBlueClient.sendEmail(email, 10, {
          decision: decision,
          price: priceStr
        });

        await swapStable(srcToken, dstToken, srcAmountBigNumber, priceNativeFixedNumber, slippage, wallet);

        await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep / Settle

        doesNeedToFetchTokenBalances = true;
      }
    } catch (e) {
      console.error(e);
    }
  }
};
