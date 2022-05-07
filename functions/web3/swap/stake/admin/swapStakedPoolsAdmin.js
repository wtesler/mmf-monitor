(async () => {
  const swapStakedPools = require("../swapStakedPools");
  const TokenNames = require("../../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic(2);

  await swapStakedPools(TokenNames.MMF_MUSD, TokenNames.MUSD, mnemonic, 'willtesler@gmail.com', 'BUY');
})();
