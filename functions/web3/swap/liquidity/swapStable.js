module.exports = async (srcToken, dstToken, srcBigNumber, nativePriceFixed, slippage, wallet) => {
  const {utils} = require("ethers");
  const FixedNumberUtils = require("../../../numbers/FixedNumberUtils");
  const ContractAddresses = require("../../../constants/ContractAddresses");
  const StablePids = require("../../../constants/StablePids");
  const resilientTransact = require("../../../web3/transact/resilientTransact");

  const ACTION = `SWAP STABLE`;

  // const provider = wallet.provider;
  // const signer = provider.getSigner();

  const dstOutFixedNumber = FixedNumberUtils.AdjustToDecimals(srcToken, dstToken, srcBigNumber);
  const adjustedDstOutFixedNumber = FixedNumberUtils.Multiply(dstOutFixedNumber, nativePriceFixed);
  const dstOutMinFixedNumber = FixedNumberUtils.Multiply(adjustedDstOutFixedNumber, slippage);
  const dstMinBigNumber = FixedNumberUtils.NumberToBigNumber(dstOutMinFixedNumber);

  const dataRow1 = '0xa6417ed6';
  const dataRow2 = `000000000000000000000000000000000000000000000000000000000000000${StablePids[srcToken]}`;
  const dataRow3 = `000000000000000000000000000000000000000000000000000000000000000${StablePids[dstToken]}`;
  const dataRow4 = utils.hexZeroPad(srcBigNumber.toHexString(), 32).replace('0x', '');
  const dataRow5 = utils.hexZeroPad(dstMinBigNumber.toHexString(), 32).replace('0x', '');

  const data = dataRow1 + dataRow2 + dataRow3 + dataRow4 + dataRow5;

  // We manually fill in this fields to save time.
  const nonce = await wallet.provider.getTransactionCount(wallet.address, "latest");
  const gasPriceWei = 5000000000000;
  const gasLimit = 700000;

  const tx = {
    from: wallet.address,
    to: ContractAddresses.STABLE_SWAP,
    value: '0x0',
    data: data,
    nonce: nonce,
    gasLimit: utils.hexlify(gasLimit),
    gasPrice: utils.hexlify(gasPriceWei),
  };

  await resilientTransact(async () => {
    // Doing it this way avoids the call to populateTransaction which saves time.
    const signedTx = await wallet.signTransaction(tx);
    return wallet.provider.sendTransaction(signedTx);
  }, 1);
};
