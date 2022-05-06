module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readLiquidity = require('../../web3/token/readLiquidity');
  const swapStakedPools = require('../../web3/swap/stake/swapStakedPools');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenNames = require('../../constants/TokenNames');

  const ACTION = `MONITOR STEP`;

  console.log(`${ACTION} | STARTED`);

  const firestore = firebaseAdmin.firestore();
  const response = await firestore.doc(`mainMonitor/config`).get();
  if (!response.exists) {
    throw new Error('No monitor config found.');
  }
  const config = response.data();

  const {email, mnemonic, pairToken, bearToken, liquidateDivergence, liquidateVolume} = config;

  const wallet = await prepareWallet(mnemonic);

  const liquidity = await readLiquidity(pairToken, wallet);

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const liquidityA = liquidity[tokenA];
  const liquidityB = liquidity[tokenB];

  const adjustedLiquidityA = FixedNumberUtils.AdjustToDecimals(tokenA, tokenB, liquidityA);

  const totalAdjustedLiquidity = adjustedLiquidityA.toUnsafeFloat() + liquidityB.toNumber();

  const diff = FixedNumberUtils.Divide(adjustedLiquidityA, liquidityB);

  const diffFloat = diff.toUnsafeFloat();

  const divergence = Math.abs(1 - diffFloat);

  const divergenceCondition = divergence > liquidateDivergence;
  const volumeCondition = totalAdjustedLiquidity < liquidateVolume;

  if (divergenceCondition || volumeCondition) {
    // noinspection ES6MissingAwait
    sendInBlueClient.sendEmail(email, 9);

    await swapStakedPools(pairToken, bearToken, mnemonic, email, 'SELL');
  }

  console.log(`${ACTION} | SUCCESS`);
};
