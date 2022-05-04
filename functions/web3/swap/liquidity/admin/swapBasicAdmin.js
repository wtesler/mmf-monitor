(async () => {
  const swapBasic = require("../swapBasic");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readTokenBalance = require("../../../token/readTokenBalance");
  const TokenNames = require("../../../../constants/TokenNames");
  const TokenDecimals = require("../../../../constants/TokenDecimals");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');
  const {ethers} = require("ethers");

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const SRC_TOKEN = TokenNames.MUSD;
  const DST_TOKEN = TokenNames.USDC;
  // const AMOUNT_NUM = 5;
  // const balanceBigNumber = ethers.utils.parseUnits(AMOUNT_NUM.toString(), TokenDecimals[SRC_TOKEN]);

  const balanceBigNumber = await readTokenBalance(SRC_TOKEN, wallet);

  await swapBasic(
    SRC_TOKEN,
    DST_TOKEN,
    balanceBigNumber,
    wallet
  );
})();
