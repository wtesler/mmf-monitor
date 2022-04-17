module.exports = async () => {
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const smma = require('../analysis/smma');
  const swapStakedPools = require('../../web3/swap/stake/swapStakedPools');

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

  if (fastIndicator < slowIndicator) {
    console.log(`${ACTION} | SELLING`);
    await updateBrokerHistorySeries(bullConfig.name, 'status', 'SELL');
    await swapStakedPools(bullConfig.name, bearConfig.name);
  } else if (fastIndicator > slowIndicator) {
    console.log(`${ACTION} | BUYING`);
    await updateBrokerHistorySeries(bullConfig.name, 'status', 'BUY');
    await swapStakedPools(bearConfig.name, bullConfig.name);
  }
};
