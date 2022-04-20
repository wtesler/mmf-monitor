(async () => {
  const unstakeMaxLiquidity = require("../unstakeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await unstakeMaxLiquidity(TokenNames.MMF_USDC, wallet);
})();
