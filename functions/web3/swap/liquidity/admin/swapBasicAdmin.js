(async () => {
  const swapBasic = require("../swapBasic");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const TokenNames = require("../../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await swapBasic(
    TokenNames.SVN,
    TokenNames.MMF,
    '0x017d62781d8fbf9a6abf',
    wallet
  );
})();
