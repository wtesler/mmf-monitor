(async () => {
  const swapBasic = require("../swapBasic");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readTokenBalance = require("../../../token/readTokenBalance");
  const TokenNames = require("../../../../constants/TokenNames");
  const TokenDecimals = require("../../../../constants/TokenDecimals");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');
  const {ethers, BigNumber} = require("ethers");

  const mnemonic = await readDefiMnemonic();

  const wallet = await prepareWallet(mnemonic);

  const SRC_TOKEN = TokenNames.MMF;
  const DST_TOKEN = TokenNames.MUSD;
  const amount = 5;
  const balanceBigNumber = ethers.utils.parseUnits(amount.toString(), TokenDecimals[SRC_TOKEN]);
  // const balanceBigNumber = BigNumber.from('36705028177096034348');
  // const balanceBigNumber = await readTokenBalance(SRC_TOKEN, wallet);

  await swapBasic(
    SRC_TOKEN,
    DST_TOKEN,
    balanceBigNumber,
    wallet
  );
})();
