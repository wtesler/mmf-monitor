(async () => {
  const swapCroForUsd = require("../swapCroForUsd");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await swapCroForUsd(20, 8, wallet);
})();
