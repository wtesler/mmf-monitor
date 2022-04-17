(async () => {
  const removeMaxLiquidity = require("../removeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  const wallet = await prepareWallet();

  await removeMaxLiquidity(TokenNames.MMF_USDC, wallet);
})();
