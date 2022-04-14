module.exports = async () => {
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistory = require('../update/updateBrokerHistory');
  const smma = require('../analysis/smma');
  const swapPools = require('../transact/swapPools');

  const ACTION = `BROKER STEP`;

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;

  const pairInfo = await DexScreenerClient.readPairInfo(NetworkNames.CRONOS, bullConfig.address);

  const bullPriceUsd = Number(pairInfo.pair.priceUsd);

  const brokerHistory = await updateBrokerHistory(bullConfig.name, bullPriceUsd);

  const historyPoints = brokerHistory.points;
  const numHistoryPoints = brokerHistory.points.length;

  const fastIndicatorPeriod = bullConfig.indicator.period.fast;
  const slowIndicatorPeriod = bullConfig.indicator.period.slow;

  if (fastIndicatorPeriod > slowIndicatorPeriod) {
    throw new Error("Fast indicator period is larger than slow indicator period which is a violation of logic.");
  }

  if (slowIndicatorPeriod > numHistoryPoints) {
    console.warn(`${ACTION} | waiting for more points before doing anything else.`);
    return;
  }

  const fastIndicator = smma(historyPoints, fastIndicatorPeriod);
  const slowIndicator = smma(historyPoints, slowIndicatorPeriod);

  if (fastIndicator < slowIndicator) {
    console.log(`${ACTION} | SELLING`);
    await swapPools(bullConfig.name, bearConfig.name);
  } else if (fastIndicator > slowIndicator) {
    console.log(`${ACTION} | BUYING`);
    await swapPools(bearConfig.name, bullConfig.name);
  }
};
