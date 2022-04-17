(async () => {
  const swapPairs = require("../swapPairs");
  const TokenNames = require("../../../../constants/TokenNames");
  const prepareWallet = require("../../../wallet/prepareWallet");

  const wallet = await prepareWallet();

  await swapPairs(
    TokenNames.MMF, TokenNames.USDC,
    TokenNames.USDC, TokenNames.USDT,
    wallet
  );

  console.log('Success');
})();
