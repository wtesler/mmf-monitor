(async () => {
  const swapStable = require("../swapStable");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const readTokenBalance = require("../../../token/readTokenBalance");
  const TokenNames = require("../../../../constants/TokenNames");
  const TokenDecimals = require("../../../../constants/TokenDecimals");
  const readDefiMnemonic = require('../../../../secrets/specific/readDefiMnemonic');
  const {ethers, utils, BigNumber} = require("ethers");
  const readNativePrice = require('../../../token/readNativePrice');
  const FixedNumberUtils = require('../../../../numbers/FixedNumberUtils');

  const mnemonic = await readDefiMnemonic(3);

  const wallet = await prepareWallet(mnemonic);

  const pairToken = TokenNames.MUSD_USDC;
  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  let priceNativeFixedNumber = await readNativePrice(pairToken, wallet);

  const SRC_TOKEN = TokenNames.USDC;
  const DST_TOKEN = TokenNames.MUSD;

  if (SRC_TOKEN !== tokenA) {
    priceNativeFixedNumber = FixedNumberUtils.Divide(1, priceNativeFixedNumber);
  }

  // const amount = 4.99;
  // const srcBigNumber = utils.parseUnits(amount.toString(), TokenDecimals[SRC_TOKEN]);
  // const srcBigNumber = BigNumber.from('36705028177096034348');
  const srcBigNumber = await readTokenBalance(SRC_TOKEN, wallet);

  await swapStable(
    SRC_TOKEN,
    DST_TOKEN,
    srcBigNumber,
    priceNativeFixedNumber,
    0.996,
    wallet
  );

  console.log('success');
})();
