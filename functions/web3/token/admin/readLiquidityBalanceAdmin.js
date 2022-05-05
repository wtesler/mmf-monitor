(async () => {
  const readLiquidityBalance = require("../readLiquidityBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const response = await readLiquidityBalance(TokenNames.MMF_MUSD, wallet);

  for (const key of Object.keys(response)) {
    console.log(`${key}: ${response[key].toString()}`);
  }
})();
