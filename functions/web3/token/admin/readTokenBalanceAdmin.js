(async () => {
  const readTokenBalance = require("../readTokenBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic(2);

  const wallet = await prepareWallet(mnemonic);

  const balance = await readTokenBalance(TokenNames.MUSD, wallet);

  console.log(balance);
  console.log(balance.toString());
})();
