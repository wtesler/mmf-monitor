(async () => {
  const swapStakedPools = require("../swapStakedPools");
  const TokenNames = require("../../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  await swapStakedPools(TokenNames.USDC_USDT, TokenNames.MMF_USDC, mnemonic, 'willtesler@gmail.com', 'BUY');
})();
