(async () => {
  const readTokenBalance = require("../readTokenBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic(1);

  const wallet = await prepareWallet(mnemonic);

  const balance = await readTokenBalance(TokenNames.USDC, wallet);

  console.log(balance);
  console.log(balance.toString());
})();
