module.exports = async () => {
  const triggerSwaps = require('./triggerSwaps');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const readWallets = require('../../wallets/read/readWallets');
  const macdVelocity = require('../analysis/macdVelocity');

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
    await updateBrokerHistorySeries(bullConfig.name, 'status', 'NONE');
    console.warn(`${ACTION} | waiting for more points before doing anything else.`);
    return;
  }

  const latestIndicator = macdVelocity(
    historyPoints,
    slowIndicatorPeriod,
    fastIndicatorPeriod,
    signalIndicatorPeriod
  );

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

  console.log(`${ACTION} | ${action}`);

  // noinspection ES6MissingAwait
  updateBrokerHistorySeries(bullConfig.name, 'status', action);

  if (action === 'NONE') {
    return;
  }

  const statuses = brokerHistory.status;

  let lastAction;
  for (let i = statuses.length - 1; i >= 0; i--) {
    const pastStatus = statuses[i];
    if (pastStatus === 'NONE') {
      continue;
    }
    lastAction = pastStatus;
    break;
  }

  if (lastAction === action) {
    console.log(`${ACTION} | ACTION IS THE SAME AS LAST ACTION`);
    return;
  }

  const srcPool = shouldSell ? bullConfig.name : bearConfig.name;
  const dstPool = shouldSell ? bearConfig.name : bullConfig.name;

  const walletDatas = await readWallets();

  for (let i = 0; i < walletDatas.length; i++) {
    const walletData = walletDatas[i];

    // Purposefully do not await this. It will start cloud function calls in the background.
    // noinspection ES6MissingAwait
    triggerSwaps(action, srcPool, dstPool, walletData);
  }
};
