(async () => {
  const swapPairs = require("../swapPairs");
  const TokenNames = require("../../../../constants/TokenNames");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await swapPairs(
    TokenNames.USDC, TokenNames.USDT,
    TokenNames.USDC, TokenNames.DAI,
    wallet
  );

  console.log('Success');
})();
