(async () => {
  const stakeMaxLiquidity = require("../stakeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  const wallet = await prepareWallet();

  await stakeMaxLiquidity(TokenNames.MMF_USDC, wallet);
})();
