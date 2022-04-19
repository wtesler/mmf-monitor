(async () => {
  const createEvenLiquidity = require("../createEvenLiquidity");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const TokenAddresses = require("../../../../constants/TokenAddresses");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  await createEvenLiquidity(
    TokenAddresses.MMF_USDC,
    wallet,
  );

  console.log("Success");
})();
