module.exports = async () => {
  const readArbitrageConfig = await require('../read/readArbitrageConfig');
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const considerSwap = require('./considerSwap');
  const PriceUpdater = require('./updaters/PriceUpdater');
  const BalanceUpdater = require('./updaters/BalanceUpdater');
  const {Subscription, interval, combineLatest, distinctUntilChanged} = require('rxjs');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const readCurrentNonce = await require('../../web3/transact/readCurrentNonce');

  const ACTION = `ARBITRAGE LOOP`;

  console.log(`${ACTION} | STARTED`);

  const priceUpdater = new PriceUpdater();
  const balanceUpdater = new BalanceUpdater();

  const subscription = new Subscription();

  let configReadTimeMs = -1;
  let wallet;

  let config;
  let nonce;

  const readConfig = async () => {
    config = await readArbitrageConfig();
    configReadTimeMs = Date.now();
    const {pairToken, mnemonic, updatePeriodMs} = config;
    wallet = await prepareWallet(mnemonic);
    nonce = await readCurrentNonce(wallet);
    priceUpdater.setConfig(pairToken, wallet, updatePeriodMs);
    balanceUpdater.setConfig(pairToken, wallet);
  };

  await readConfig();

  // Refresh config every 10 minutes in case it changed on the backend.
  subscription.add(
    interval(600000).subscribe(() => {
      readConfig();
    })
  );

  priceUpdater.start();

  let isSwapping = false;
  let isUpdatingBalance = false;
  let needsBalanceUpdate = true;

  const onSwapResult = async(result, err) => {
    nonce = await readCurrentNonce(wallet);
    isSwapping = false;
    needsBalanceUpdate = true;
  };

  const onUpdate = async ([priceFloat, [balanceA, balanceB]]) => {
    if (isUpdatingBalance) {
      return;
    }

    if (needsBalanceUpdate) {
      isUpdatingBalance = true;
      await balanceUpdater.update((didUpdate) => {
        isUpdatingBalance = false;
        if (didUpdate) {
          needsBalanceUpdate = false;
        }
      });
      return;
    }

    if (priceFloat === null || balanceA === null || balanceB === null) {
      return;
    }

    if (isSwapping) {
      return;
    }

    isSwapping = considerSwap(priceFloat, balanceA, balanceB, wallet, config, onSwapResult, nonce, sendInBlueClient);
  };

  subscription.add(
    combineLatest(
      priceUpdater.observe(),
      balanceUpdater.observe().pipe(distinctUntilChanged())
    )
      .subscribe(onUpdate)
  );
};
