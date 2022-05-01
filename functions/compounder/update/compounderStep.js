module.exports = async () => {
  const readWallets = require('../../wallets/read/readWallets');
  const harvestRewardAndRestake = require('./harvestRewardAndRestake');

  const ACTION = `COMPOUNDER STEP`;

  console.log(`${ACTION} | STARTED`);

  const walletDatas = await readWallets();

  for (let i = 0; i < walletDatas.length; i++) {
    const walletData = walletDatas[i];

    await harvestRewardAndRestake(walletData);
  }

  console.log(`${ACTION} | SUCCESS`);
};
