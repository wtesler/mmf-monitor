module.exports = async () => {
  const triggerSwaps = require('./triggerSwaps');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const readStakedBalance = require('../../web3/token/readStakedBalance');
  const readWallets = require('../../wallets/read/readWallets');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const macd = require('macd');

  const ACTION = `BROKER STEP`;

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;

  const pairInfo = await DexScreenerClient.readPairInfo(NetworkNames.CRONOS, bullConfig.address);
  const pair = pairInfo.pair;
  const bullPriceUsd = pair.liquidity.quote / pair.liquidity.base;

  const brokerHistory = await updateBrokerHistorySeries(bullConfig.name, 'points', bullPriceUsd);

  const historyPoints = brokerHistory.points;
  const numHistoryPoints = historyPoints.length;

  const fastIndicatorPeriod = bullConfig.indicator.period.fast;
  const slowIndicatorPeriod = bullConfig.indicator.period.slow;
  const signalIndicatorPeriod = bullConfig.indicator.period.signal;
  const signalThreshold = bullConfig.indicator.threshold;

  if (slowIndicatorPeriod > numHistoryPoints) {
    // noinspection ES6MissingAwait
    updateBrokerHistorySeries(bullConfig.name, 'status', 'NONE');
    console.warn(`${ACTION} | waiting for more points before doing anything else.`);
    return;
  }

  const macdResults = macd(historyPoints, slowIndicatorPeriod, fastIndicatorPeriod, signalIndicatorPeriod);
  const histogram = macdResults.histogram;
  const latestIndicator = histogram[histogram.length - 1];

  // noinspection ES6MissingAwait
  updateBrokerHistorySeries(bullConfig.name, 'indicator', latestIndicator);

  const shouldSell = latestIndicator < -signalThreshold;
  const shouldBuy = latestIndicator > signalThreshold;

  let action = 'NONE';
  if (shouldSell) {
    action = 'SELL';
  } else if (shouldBuy) {
    action = 'BUY';
  }

  // noinspection ES6MissingAwait
  updateBrokerHistorySeries(bullConfig.name, 'status', action);

  const srcPool = shouldSell ? bullConfig.name : bearConfig.name;
  const dstPool = shouldSell ? bearConfig.name : bullConfig.name;

  console.log(`${ACTION} | ${action}`);

  if (!shouldSell && !shouldBuy) {
    return;
  }

  const wallets = await readWallets();

  for (const walletData of wallets) {
    const {mnemonic} = walletData;

    const wallet = await prepareWallet(mnemonic);

    const pairTokenBalance = await readStakedBalance(srcPool, wallet);

    if (pairTokenBalance === 0) {
      continue;
    }

    // Purposefully do not await this. It will start cloud function calls in the background.
    // noinspection ES6MissingAwait
    triggerSwaps(action, srcPool, dstPool, walletData);
  }
};
