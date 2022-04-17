(async () => {
  const createEqualLiquidity = require("../createEqualLiquidity");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const TokenAddresses = require("../../../../constants/TokenAddresses");

  const wallet = await prepareWallet();

  await createEqualLiquidity(
    TokenAddresses.USDC_USDT,
    wallet,
  );

  console.log("Success");
})();
