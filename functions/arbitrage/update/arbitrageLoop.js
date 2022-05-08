module.exports = async () => {
  const readArbitrageConfig = await require('../read/readArbitrageConfig');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const arbitrageLoopBody = require('./arbitrageLoopBody');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  let config;
  let configReadTimeMs = -1;
  let wallet;

  const refreshConfig = async() => {
    config = await readArbitrageConfig();
    configReadTimeMs = Date.now();
    const {mnemonic} = config;
    wallet = await prepareWallet(mnemonic);
  };

  const sharedObj = {
    tokenABalanceBigNumber: null,
    tokenBBalanceBigNumber: null,
    doesNeedToFetchTokenBalances: true,
    isFetchingTokenBalances: false,
    lastPriceStr: null,
    isSwapping: false,
    didJustSuccessfullySwap: false,
    numBodies: 0,
  };

  // noinspection InfiniteLoopJS
  while (true) {
    if (Date.now() - configReadTimeMs > 600000) { // Every 10 minutes.
      await refreshConfig();
    }

    if (sharedObj.numBodies < 3) {
      // noinspection ES6MissingAwait
      arbitrageLoopBody(config, sharedObj, wallet);
    } else {
      // console.warn("Skipping because too many simultaneous requests.");
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep
  }
};
