(async () => {
  const readCurrentNonce = require("../readCurrentNonce");
  const prepareWallet = require("../../wallet/prepareWallet");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const startTimeMs = Date.now();

  const mnemonic = await readDefiMnemonic(3);

  const wallet = await prepareWallet(mnemonic);

  const nonce = await readCurrentNonce(wallet);

  console.log(nonce);

  console.log(`It took ${(Date.now() - startTimeMs) / 1000} seconds.`)
})();
