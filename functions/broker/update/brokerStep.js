module.exports = async () => {
  const triggerSwaps = require('./triggerSwaps');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const readNativePrice = require('../../web3/token/readNativePrice');
  const prepareProvider = require('../../web3/wallet/prepareProvider');
  const updateBrokerHistorySeries = require('./updateBrokerHistorySeries');
  const updateBrokerActionTimes = require('./updateBrokerActionTimes');
  const readWallets = require('../../wallets/read/readWallets');
  const smmaStrategy = require('../analysis/stratagies/smmaStrategy');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');

  const ACTION = `BROKER STEP`;

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;
  const isActive = config.isActive;

  const bullPairToken = bullConfig.name;
  const bearPairToken = bearConfig.name;

  const bullIndicator = bullConfig.indicator;

  const provider = prepareProvider();

  console.log(bullPairToken);

  const bullPrice = await readNativePrice(bullPairToken, provider);
  const bullPriceFloat = bullPrice.toUnsafeFloat();

  const brokerHistory = await updateBrokerHistorySeries(bullPairToken, 'prices', bullPriceFloat);

  const historyPrices = brokerHistory.prices;
  const numHistoryPrices = historyPrices.length;

  const fastIndicatorPeriod = bullIndicator.period.fast;
  const slowIndicatorPeriod = bullIndicator.period.slow;
  // const threshold = bullIndicator.threshold;

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
  // const lastActionTimeMs = actionHistory.lastActionTimeMs;

  // const currentStreakMs = Date.now() - curActionTimeMs;
  // const previousStreakMs = curActionTimeMs - lastActionTimeMs;

  const isSellIndicator = latestIndicator < 0;

  let action = 'NONE';

  if (isSellIndicator && curAction === 'BUY' || !isSellIndicator && curAction === 'SELL') {

    action = isSellIndicator ? 'SELL' : 'BUY';

    // if (currentStreakMs / previousStreakMs > threshold) {
    //   action = isSellIndicator ? 'SELL' : 'BUY';
    // } else {
    //   console.log(`${ACTION} | WOULD CHANGE POSITION BUT WE DID SO TOO RECENTLY.`);
    // }
  }

  console.log(`${ACTION} | ${action}`);

  // noinspection ES6MissingAwait
  // updateBrokerHistorySeries(bullConfig.name, 'action', action);

  if (action === 'NONE') {
    return;
  }

  await updateBrokerActionTimes(bullPairToken, curAction, curActionTimeMs, action);

  if (!isActive) {
    return;
  }

  // const srcPool = isSellIndicator ? bullConfig.name : bearConfig.name;
  // const dstPool = isSellIndicator ? bearConfig.name : bullConfig.name;

  const walletDatas = await readWallets();

  for (let i = 0; i < walletDatas.length; i++) {
    const walletData = walletDatas[i];

    const {email} = walletData;

    await sendInBlueClient.sendEmail(email, 8, {
      signal: action,
      pool: bullPairToken,
      price: bullPriceFloat
    });

    // Purposefully do not await this. It will start cloud function calls in the background.
    // noinspection ES6MissingAwait
    // triggerSwaps(action, srcPool, dstPool, bullPrice, walletData);
  }
};
