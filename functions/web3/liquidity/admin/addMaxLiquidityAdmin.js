(async () => {
  const addMaxLiquidity = require("../addMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await addMaxLiquidity(TokenNames.MMF, TokenNames.USDC, TokenAddresses.MMF_USDC, wallet);
})();
