module.exports = async () => {
  const readArbitrageConfigs = await require('../read/readArbitrageConfigs');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const considerSwap = require('./considerSwap');
  const PriceUpdater = require('./updaters/PriceUpdater');
  const BalanceUpdater = require('./updaters/BalanceUpdater');
  const {Subscription, interval, combineLatest, distinctUntilChanged} = require('rxjs');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readCurrentNonce = await require('../../web3/transact/readCurrentNonce');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  let subscription = new Subscription();

  let configs = {};

  const onSwapResult = async (result, err, config) => {
    config.nonce = await readCurrentNonce(config.wallet);
    config.isSwapping = false;
    config.needsBalanceUpdate = true;
    if (!err) {
      config.needsToReportSuccess = true;
    }
  };

  const onUpdate = async ([priceFloat, [balanceA, balanceB]], config) => {
    if (config.isUpdatingBalance) {
      return;
    }

    const {balanceUpdater, wallet, nonce, email} = config;

    if (config.needsBalanceUpdate) {
      config.isUpdatingBalance = true;
      await balanceUpdater.update((updateObj) => {
        config.isUpdatingBalance = false;
        if (updateObj) {
          const [tokenA, tokenB, balanceAUsd, balanceBUsd] = updateObj;
          config.needsBalanceUpdate = false;
          if (config.needsToReportSuccess) {
            // noinspection ES6MissingAwait
            sendInBlueClient.sendEmail(email, 11, {
              tokenA: tokenA,
              tokenB: tokenB,
              tokenABalanceUsd: balanceAUsd,
              tokenBBalanceUsd: balanceBUsd,
            });
            config.needsToReportSuccess = false;
          }
        }
      });
      return;
    }

    if (priceFloat === null || balanceA === null || balanceB === null) {
      return;
    }

    if (config.isSwapping) {
      return;
    }

    const configOnSwapResult = (result,error) => onSwapResult(result, error, config);

    config.isSwapping = considerSwap(priceFloat, balanceA, balanceB, wallet, config, configOnSwapResult, nonce, sendInBlueClient);
  };

  const readConfigs = async () => {
    subscription.unsubscribe();
    subscription = new Subscription();

    for (const pairToken of Object.keys(configs)) {
      if (configs[pairToken].priceUpdater) {
        configs[pairToken].priceUpdater.stop();
      }
    }

    configs = await readArbitrageConfigs();

    const sleepOffsetMs = 1000 + (1000 / configs.length);

    for (const config of configs) {
      const {pairToken, mnemonic} = config;
      config.wallet = await prepareWallet(mnemonic);
      config.nonce = await readCurrentNonce(config.wallet);
      config.priceUpdater = new PriceUpdater();
      config.balanceUpdater = new BalanceUpdater();

      config.priceUpdater.setConfig(pairToken, config.wallet);
      config.balanceUpdater.setConfig(pairToken, config.wallet);

      config.needsBalanceUpdate = true;

      subscription.add(
        combineLatest(
          config.priceUpdater.observe(),
          config.balanceUpdater.observe().pipe(distinctUntilChanged())
        )
          .subscribe(x => {
            onUpdate(x, config)
          })
      );

      config.priceUpdater.start();

      await new Promise(resolve => setTimeout(resolve, sleepOffsetMs)); // Sleep
    }
  };

  await readConfigs();

  // Refresh config every 10 minutes in case it changed on the backend.
  subscription.add(
    interval(600000).subscribe(() => {
      readConfigs();
    })
  );
};
