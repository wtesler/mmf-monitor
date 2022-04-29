(async () => {
  const swapHalfLiquidity = require("../swapHalfLiquidity");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const TokenAddresses = require("../../../../constants/TokenAddresses");
  const TokenNames = require("../../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await swapHalfLiquidity(
    TokenNames.MMF,
    TokenNames.MUSD,
    TokenAddresses.MMF_MUSD,
    wallet
  );
})();
