(async () => {
  const readTokenBalance = require("../readTokenBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const balance = await readTokenBalance(TokenNames.MMF_USDC, wallet);

  console.log(balance);
})();
