(async () => {
  const swapStakedPools = require("../swapStakedPools");
  const TokenNames = require("../../../../constants/TokenNames");

  await swapStakedPools(TokenNames.MMF_USDC, TokenNames.USDC_USDT);
})();
