module.exports = async () => {
  const readArbitrageConfigs = await require('../read/readArbitrageConfigs');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const considerSwap = require('./considerSwap');
  const PriceUpdater = require('./updaters/PriceUpdater');
  const BalanceUpdater2 = require('./updaters/BalanceUpdater2');
  const {Subscription, interval, combineLatest, distinctUntilChanged} = require('rxjs');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readCurrentNonce = await require('../../web3/transact/readCurrentNonce');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  let stepSubscription = new Subscription();
  let intervalSubscription = new Subscription();

  let configs = {};

  const balanceUpdater = new BalanceUpdater2();

  const onSwapResult = async (completedTx, err, config) => {
    config.nonce = await readCurrentNonce(config.wallet);
    config.isSwapping = false;
    config.needsBalanceUpdate = true;
    if (!err) { // Success
      // noinspection ES6MissingAwait
      sendInBlueClient.sendEmail(config.email, 11, {
        pairToken: config.pairToken,
        transactionHash: completedTx.transactionHash
      });
    }
  };

  const onUpdate = async ([priceFloat, [balanceA, balanceB]], config) => {
    if (config.isUpdatingBalance) {
      return;
    }

    const {pairToken, wallet, nonce} = config;

    if (config.needsBalanceUpdate) {
      config.isUpdatingBalance = true;
      await balanceUpdater.update(pairToken, (updateObj) => {
        config.isUpdatingBalance = false;
        if (updateObj) {
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

    const configOnSwapResult = (completedTx, error) => onSwapResult(completedTx, error, config);

    config.isSwapping = considerSwap(priceFloat, balanceA, balanceB, wallet, config, configOnSwapResult, nonce, sendInBlueClient);
  };

  const readConfigs = async () => {
    stepSubscription.unsubscribe();
    stepSubscription = new Subscription();

    for (const pairToken of Object.keys(configs)) {
      if (configs[pairToken].priceUpdater) {
        configs[pairToken].priceUpdater.stop();
      }
    }

    configs = await readArbitrageConfigs();

    configs = configs.filter(x => x.enabled);

    const sleepOffsetMs = 1000 + (1000 / configs.length);

    for (let i = 1; i < configs.length; i++) {
      if (configs[i].mnemonic !== configs[i - 1].mnemonic) {
        throw new Error("Current implementation requires all configs to have same mnemonic");
      }
    }

    for (const config of configs) {
      const {pairToken, mnemonic} = config;
      config.wallet = await prepareWallet(mnemonic);
      config.nonce = await readCurrentNonce(config.wallet);
      config.priceUpdater = new PriceUpdater();

      balanceUpdater.setWallet(config.wallet);

      config.needsBalanceUpdate = true;

      config.priceUpdater.setConfig(pairToken, config.wallet);

      stepSubscription.add(
        combineLatest(
          config.priceUpdater.observe(),
          balanceUpdater.observe(pairToken).pipe(distinctUntilChanged())
        )
          .subscribe(x => {
            onUpdate(x, config)
          })
      );

      balanceUpdater.register(pairToken);

      config.priceUpdater.start();

      await new Promise(resolve => setTimeout(resolve, sleepOffsetMs)); // Sleep
    }
  };

  await readConfigs();

  // Refresh config every 10 minutes in case it changed on the backend.
  intervalSubscription.add(
    interval(600000).subscribe(() => {
      readConfigs();
    })
  );
};
