(async () => {
  const stakeMaxLiquidity = require("../stakeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic(1);

  const wallet = await prepareWallet(mnemonic);

  await stakeMaxLiquidity(TokenNames.MUSD_USDC, wallet);
})();
