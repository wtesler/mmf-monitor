(async () => {
  const createMaxLiquidity = require("../createMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const poolSizeUsd = await createMaxLiquidity(TokenNames.MMF, TokenNames.MUSD, TokenAddresses.MMF_MUSD, wallet);

  console.log(poolSizeUsd);
})();
