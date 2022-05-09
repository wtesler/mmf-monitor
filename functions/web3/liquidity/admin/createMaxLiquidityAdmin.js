(async () => {
  const createMaxLiquidity = require("../createMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic(1);

  const wallet = await prepareWallet(mnemonic);

  await createMaxLiquidity(TokenNames.MUSD_USDC, wallet);
})();
