module.exports = async () => {
  const triggerSwaps = require('./triggerSwaps');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const updateBrokerActionTimes = require('./updateBrokerActionTimes');
  const readWallets = require('../../wallets/read/readWallets');
  const smmaStrategy = require('../analysis/stratagies/smmaStrategy');

  const ACTION = `BROKER STEP`;

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;
  const isActive = config.isActive;

  const pairInfo = await DexScreenerClient.readPairInfo(NetworkNames.CRONOS, bullConfig.address);
  const pair = pairInfo.pair;
  const bullPrice = pair.liquidity.quote / pair.liquidity.base;

  const brokerHistory = await updateBrokerHistorySeries(bullConfig.name, 'prices', bullPrice);

  if (!isActive) {
    return;
  }

  const historyPrices = brokerHistory.prices;
  const numHistoryPrices = historyPrices.length;

  const fastIndicatorPeriod = bullConfig.indicator.period.fast;
  const slowIndicatorPeriod = bullConfig.indicator.period.slow;
  const threshold = bullConfig.indicator.threshold;

  if (slowIndicatorPeriod > numHistoryPrices) {
    // await updateBrokerHistorySeries(bullConfig.name, 'action', action);
    console.warn(`${ACTION} | waiting for more points before doing anything else.`);
    return;
  }

  const latestIndicator = smmaStrategy(
    historyPrices,
    slowIndicatorPeriod,
    fastIndicatorPeriod
  );

  // noinspection ES6MissingAwait
  // updateBrokerHistorySeries(bullConfig.name, 'indicator', latestIndicator);

  const actionHistory = brokerHistory.action;

  const curAction = actionHistory.curAction;
  const curActionTimeMs = actionHistory.curActionTimeMs;
  const lastActionTimeMs = actionHistory.lastActionTimeMs;

  //const [lastAction, currentStreak, previousStreak] = brokerAction(actions);

  const currentStreakMs = Date.now() - curActionTimeMs;
  const previousStreakMs = curActionTimeMs - lastActionTimeMs;

  const isSellIndicator = latestIndicator < 0;

  let action = 'NONE';

  if (isSellIndicator && curAction === 'BUY' || !isSellIndicator && curAction === 'SELL') {
    if (currentStreakMs / previousStreakMs > threshold) {
      action = isSellIndicator ? 'SELL' : 'BUY';
    } else {
      console.log(`${ACTION} | WOULD CHANGE POSITION BUT WE DID SO TOO RECENTLY.`);
    }
  }

  console.log(`${ACTION} | ${action}`);

  // noinspection ES6MissingAwait
  // updateBrokerHistorySeries(bullConfig.name, 'action', action);

  if (action === 'NONE') {
    return;
  }

  await updateBrokerActionTimes(bullConfig.name, curAction, curActionTimeMs, action);

  const srcPool = isSellIndicator ? bullConfig.name : bearConfig.name;
  const dstPool = isSellIndicator ? bearConfig.name : bullConfig.name;

  const walletDatas = await readWallets();

  for (let i = 0; i < walletDatas.length; i++) {
    const walletData = walletDatas[i];

    // Purposefully do not await this. It will start cloud function calls in the background.
    // noinspection ES6MissingAwait
    triggerSwaps(action, srcPool, dstPool, bullPrice, walletData);
  }
};
