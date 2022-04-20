(async () => {
  const swapStakedPools = require("../swapStakedPools");
  const TokenNames = require("../../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  await swapStakedPools(TokenNames.MMF_USDC, TokenNames.USDC_USDT, mnemonic, 'willtesler@gmail.com', 'SELL');
})();
