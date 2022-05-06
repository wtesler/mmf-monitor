module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const readNativePrice = require('../../web3/token/readNativePrice');
  const swapStable = require('../../web3/swap/liquidity/swapStable');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
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

  const {email, mnemonic, pairToken, sellThreshold, buyThreshold} = config;

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const wallet = await prepareWallet(mnemonic);

  let [priceNativeFixedNumber, tokenABalanceBigNumber, tokenBBalanceBigNumber] = await Promise.all([
    readNativePrice(pairToken, wallet),
    readTokenBalance(tokenA, wallet, false),
    readTokenBalance(tokenB, wallet, false),
  ]);

  const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();

  console.log(`${ACTION} | PRICE: ${priceNativeFloat.toFixed(4)}`);

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
    await swapStable(srcToken, dstToken, srcAmountBigNumber, priceNativeFixedNumber, wallet);
  }

  console.log(`${ACTION} | SUCCESS`);
};
