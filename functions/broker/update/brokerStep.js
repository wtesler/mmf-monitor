module.exports = async () => {
  const triggerSwaps = require('./triggerSwaps');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const smma = require('../analysis/smma');

  const ACTION = `BROKER STEP`;

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;

  const pairInfo = await DexScreenerClient.readPairInfo(NetworkNames.CRONOS, bullConfig.address);

  const bullPriceUsd = Number(pairInfo.pair.priceUsd);

  const brokerHistory = await updateBrokerHistorySeries(bullConfig.name, 'points', bullPriceUsd);

  const historyPoints = brokerHistory.points;
  const numHistoryPoints = historyPoints.length;

  const fastIndicatorPeriod = bullConfig.indicator.period.fast;
  const slowIndicatorPeriod = bullConfig.indicator.period.slow;

  if (fastIndicatorPeriod > slowIndicatorPeriod) {
    throw new Error("Fast indicator period is larger than slow indicator period which is a violation of logic.");
  }

  if (slowIndicatorPeriod > numHistoryPoints) {
    await updateBrokerHistorySeries(bullConfig.name, 'status', 'NONE');
    console.warn(`${ACTION} | waiting for more points before doing anything else.`);
    return;
  }

  const fastIndicator = smma(historyPoints, fastIndicatorPeriod);
  const slowIndicator = smma(historyPoints, slowIndicatorPeriod);

  const shouldSell = fastIndicator < slowIndicator;

  const action = shouldSell ? 'SELL' : 'BUY';

  console.log(`${ACTION} | ${action}`);

  await updateBrokerHistorySeries(bullConfig.name, 'status', action);

  const srcPool = shouldSell ? bullConfig.name : bearConfig.name;
  const dstPool = shouldSell ? bearConfig.name : bullConfig.name;

  // Purposefully do not await this. It will start function calls in the background.
  // noinspection ES6MissingAwait
  triggerSwaps(srcPool, dstPool);

  console.log(`${ACTION} | SUCCESS`);
};
