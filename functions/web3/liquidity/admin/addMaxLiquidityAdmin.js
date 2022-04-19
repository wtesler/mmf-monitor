(async () => {
  const addMaxLiquidity = require("../addMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const poolSizeUsd = await addMaxLiquidity(TokenNames.USDC, TokenNames.USDT, TokenAddresses.USDC_USDT, wallet);

  console.log(poolSizeUsd);
})();
