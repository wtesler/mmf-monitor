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

  const ACTION = `ARBITRAGE STEP`;

  console.log(`${ACTION} | STARTED`);

  const firestore = firebaseAdmin.firestore();
  const response = await firestore.doc(`arbitrage/config`).get();
  if (!response.exists) {
    throw new Error('No arbitrage config found.');
  }
  const config = response.data();

  const {email, mnemonic, pairToken, sellThreshold, buyThreshold, baseSlippage} = config;

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const wallet = await prepareWallet(mnemonic);

  let [priceNativeFixedNumber, tokenABalanceBigNumber, tokenBBalanceBigNumber] = await Promise.all([
    readNativePrice(pairToken, wallet),
    readTokenBalance(tokenA, wallet, false),
    readTokenBalance(tokenB, wallet, false),
  ]);

  // dexScreenerClient.readPairInfo(pairToken)
  // const pair = pairInfo.pair;
  // const priceNative = Number(pairInfo.priceNative);

  const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();

  console.log(`${ACTION} | PRICE: ${priceNativeFloat.toFixed(6)}`);

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
      price: priceNativeFloat.toFixed(6)
    });

    await swapStable(srcToken, dstToken, srcAmountBigNumber, priceNativeFixedNumber, baseSlippage, wallet);
  }

  console.log(`${ACTION} | SUCCESS`);
};
