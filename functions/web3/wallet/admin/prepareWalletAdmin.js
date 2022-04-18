(async () => {
  const prepareWallet = require("../prepareWallet");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  console.log(wallet);
})();
