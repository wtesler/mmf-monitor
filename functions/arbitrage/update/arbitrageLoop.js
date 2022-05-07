module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const arbitrageLoopBody = require('./arbitrageLoopBody');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  const firestore = firebaseAdmin.firestore();
  const response = await firestore.doc(`arbitrage/config`).get();
  if (!response.exists) {
    throw new Error('No arbitrage config found.');
  }
  const config = response.data();

  const {mnemonic} = config;

  const wallet = await prepareWallet(mnemonic);

  const mutexObj = {
    tokenABalanceBigNumber: null,
    tokenBBalanceBigNumber: null,
    doesNeedToFetchTokenBalances: true,
    isFetchingTokenBalances: false,
    lastPriceStr: null,
    isSwapping: false,
    numBodies: 0
  };

  // noinspection InfiniteLoopJS
  while (true) {
    // noinspection ES6MissingAwait
    if (mutexObj.numBodies < 3) {
      arbitrageLoopBody(config, mutexObj, wallet);
    } else {
      // console.warn("Skipping because too many simultaneous requests.");
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep
  }
};
