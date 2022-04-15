(async () => {
  const addMaxLiquidity = require("../addMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  const wallet = await prepareWallet();

  await addMaxLiquidity(TokenNames.USDC, TokenNames.USDT, wallet);
})();
