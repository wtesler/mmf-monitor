(async () => {
  const swapPairs = require("../swapPairs");
  const TokenNames = require("../../../../constants/TokenNames");
  const prepareWallet = require("../../../wallet/prepareWallet");

  const wallet = await prepareWallet();

  await swapPairs(
    TokenNames.USDC, TokenNames.USDT,
    TokenNames.MMF, TokenNames.USDC,
    wallet
  );

  console.log('Success');
})();
