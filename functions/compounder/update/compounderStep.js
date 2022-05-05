module.exports = async () => {
  const readCompounderWallets = require('../../wallets/read/readCompounderWallets');
  const triggerHarvests = require('./triggerHarvests');

  const ACTION = `COMPOUNDER STEP`;

  console.log(`${ACTION} | STARTED`);

  const walletDatas = await readCompounderWallets();

  for (let i = 0; i < walletDatas.length; i++) {
    const walletData = walletDatas[i];

    // noinspection ES6MissingAwait
    triggerHarvests(walletData);
  }

  console.log(`${ACTION} | SUCCESS`);
};
