(async () => {
  const swapPairs = require("../swapPairs");
  const TokenNames = require("../../../../constants/TokenNames");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await swapPairs(
    TokenNames.USDC, TokenNames.USDT,
    TokenNames.MMF, TokenNames.USDC,
    wallet
  );

  console.log('Success');
})();
