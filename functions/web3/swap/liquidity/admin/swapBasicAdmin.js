(async () => {
  const swapBasic = require("../swapBasic");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readTokenBalance = require("../../../token/readTokenBalance");
  const TokenNames = require("../../../../constants/TokenNames");
  const TokenDecimals = require("../../../../constants/TokenDecimals");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');
  const {ethers, BigNumber} = require("ethers");

  const mnemonic = await readDefiMnemonic(2);

  const wallet = await prepareWallet(mnemonic);

  const SRC_TOKEN = TokenNames.MUSD;
  const DST_TOKEN = TokenNames.USDC;
  const amount = 3;
  const balanceBigNumber = ethers.utils.parseUnits(amount.toString(), TokenDecimals[SRC_TOKEN]);
  // const balanceBigNumber = BigNumber.from('5622291088399747488079');
  // const balanceBigNumber = await readTokenBalance(SRC_TOKEN, wallet);

  await swapBasic(
    SRC_TOKEN,
    DST_TOKEN,
    balanceBigNumber,
    wallet
  );
})();
