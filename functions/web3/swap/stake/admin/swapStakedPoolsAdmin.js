(async () => {
  const swapStakedPools = require("../swapStakedPools");
  const TokenNames = require("../../../../constants/TokenNames");

  await swapStakedPools(TokenNames.USDC_USDT, TokenNames.MMF_USDC);
})();
