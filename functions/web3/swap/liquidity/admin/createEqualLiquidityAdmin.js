(async () => {
  const createEqualLiquidity = require("../createEqualLiquidity");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const TokenAddresses = require("../../../../constants/TokenAddresses");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await createEqualLiquidity(
    TokenAddresses.USDC_USDT,
    wallet,
  );

  console.log("Success");
})();
