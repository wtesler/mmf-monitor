(async () => {
  const stakeMaxLiquidity = require("../stakeMaxLiquidity");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");
  const readDefiMnemonic = require('../../../secrets/specific/readDefiMnemonic');

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const stakedBalance = await stakeMaxLiquidity(TokenNames.USDC_USDT, wallet);

  console.log(stakedBalance);
})();
