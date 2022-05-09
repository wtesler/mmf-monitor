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
  };

  const onUpdate = async ([priceFloat, [balanceA, balanceB]], config) => {
    if (config.isUpdatingBalance) {
      return;
    }

    const {balanceUpdater, wallet, nonce} = config;

    if (config.needsBalanceUpdate) {
      config.isUpdatingBalance = true;
      await balanceUpdater.update((didUpdate) => {
        config.isUpdatingBalance = false;
        if (didUpdate) {
          config.needsBalanceUpdate = false;
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

    for (const config of configs) {
      const {pairToken, mnemonic, updatePeriodMs} = config;
      config.wallet = await prepareWallet(mnemonic);
      config.nonce = await readCurrentNonce(config.wallet);
      config.priceUpdater = new PriceUpdater();
      config.balanceUpdater = new BalanceUpdater();

      config.priceUpdater.setConfig(pairToken, config.wallet, updatePeriodMs);
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
    }
  };

  await readConfigs();

  // Refresh config every 10 minutes in case it changed on the backend.
  subscription.add(
    interval(300000).subscribe(() => {
      readConfigs();
    })
  );
};
