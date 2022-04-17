(async () => {
  const addMaxLiquidity = require("../addMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const wallet = await prepareWallet();

  await addMaxLiquidity(TokenNames.MMF, TokenNames.USDC, TokenAddresses.MMF_USDC, wallet);
})();
