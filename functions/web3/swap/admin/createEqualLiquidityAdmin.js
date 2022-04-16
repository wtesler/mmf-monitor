(async () => {
  const createEqualLiquidity = require("../createEqualLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const wallet = await prepareWallet();

  await createEqualLiquidity(
    TokenAddresses.MMF_USDC,
    wallet,
  );

  console.log("Success");
})();
