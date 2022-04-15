(async () => {
  const unstakeMaxLiquidity = require("../unstakeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  const wallet = await prepareWallet();

  await unstakeMaxLiquidity(TokenNames.USDC_USDT, wallet);
})();
