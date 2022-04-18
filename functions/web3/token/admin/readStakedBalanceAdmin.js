(async () => {
  const readStakedBalance = require("../readStakedBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const balance = await readStakedBalance(TokenNames.USDC_USDT, wallet);

  console.log(balance);
})();
