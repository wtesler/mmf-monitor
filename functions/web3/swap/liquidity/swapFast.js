/**
 * A faster alternative to `swapBasic` where we manually set gas prices and avoid `populateTransaction` call.
 * More rigid and likely to fail in some scenarios.
 */
module.exports = async (srcToken, dstToken, srcBigNumber, nativePriceFixed, slippage, wallet) => {
  const {utils, BigNumber} = require("ethers");
  const FixedNumberUtils = require("../../../numbers/FixedNumberUtils");
  const ContractAddresses = require("../../../constants/ContractAddresses");
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const resilientTransact = require("../../../web3/transact/resilientTransact");

  const ACTION = `SWAP FAST`;

  console.log(`${ACTION} | TOKENS: ${srcToken} -> ${dstToken}`);

  const dstOutFixedNumber = FixedNumberUtils.AdjustToDecimals(srcToken, dstToken, srcBigNumber);
  const adjustedDstOutFixedNumber = FixedNumberUtils.Multiply(dstOutFixedNumber, nativePriceFixed);
  const dstOutMinFixedNumber = FixedNumberUtils.Multiply(adjustedDstOutFixedNumber, slippage);
  const dstMinBigNumber = FixedNumberUtils.NumberToBigNumber(dstOutMinFixedNumber);

  const deadline = BigNumber.from((Date.now() + 1000 * 60 * 2).toString()).toHexString();

  const toPaddedString = (hexString) => {
    return utils.hexZeroPad(hexString, 32).replace('0x', '');
  };

  const dataArr = [
    '0x38ed1739', // Method ID of swapExactTokensForTokens
    toPaddedString(srcBigNumber.toHexString()), // src amount
    toPaddedString(dstMinBigNumber.toHexString()), // dst amount min
    `00000000000000000000000000000000000000000000000000000000000000a0`, // WTF is this. (160 in decimal)
    toPaddedString(wallet.address), // our own address
    toPaddedString(deadline), // deadline
    `0000000000000000000000000000000000000000000000000000000000000002`, // Number of hops?
    toPaddedString(TokenAddresses[srcToken]), // src internal transaction
    toPaddedString(TokenAddresses[dstToken]), // dst internal transaction
  ];

  const data = dataArr.join('');

  const gasPriceWei = 7000000000000;
  const gasLimit = 300000;

  const nonce = await wallet.provider.getTransactionCount(wallet.address, "latest");

  const tx = {
    from: wallet.address,
    to: ContractAddresses.ROUTER_MEERKAT,
    value: '0x0',
    data: data,
    nonce: nonce,
    gasLimit: utils.hexlify(gasLimit),
    gasPrice: utils.hexlify(gasPriceWei),
  };

  console.log(`${ACTION} | Swapping ${srcBigNumber.toString()} ${srcToken} for atleast ${dstMinBigNumber.toString()} ${dstToken}.`);

  await resilientTransact(async () => {
    const signedTx = await wallet.signTransaction(tx);
    return wallet.provider.sendTransaction(signedTx);
  }, 1);

  console.log(`${ACTION} | SUCCESS`);
};
