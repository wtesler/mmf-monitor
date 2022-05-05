/**
 * Swaps the tokens as defined by the parameter function outputs.
 * @param parameterFunction A function which returns [srcBigNumber, dstMinBigNumber, internalTransactions]
 * where `srcBigNumber` is the src amount to trade, `dstMinBigNumber` is the minimum amount to receive,
 * and `internalTransactions` define the route needed to swap between the two tokens.
 * @param wallet The wallet.
 * @return {Promise<*[]>} A promise which resolves to the [srcBigNumber, dstMinBigNumber]
 */
module.exports = async (parameterFunction, wallet) => {
  const {ethers} = require("ethers");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const routerAbi = require("../contracts/abis/meerkat_router_abi.json");

  const contract = new ethers.Contract(ContractAddresses.ROUTER_MEERKAT, routerAbi, wallet);

  let srcBigNumberValue;
  let dstMinBigNumberValue;

  await resilientTransact(async () => {
    const [srcBigNumber, dstMinBigNumber, internalTransactions] = await parameterFunction();

    srcBigNumberValue = srcBigNumber;
    dstMinBigNumberValue = dstMinBigNumber;

    if (srcBigNumber === null
      || dstMinBigNumber === null
      || internalTransactions === null
      || srcBigNumber.isZero()
    ) {
      console.log('SWAP TOKENS | NOT SWAPPING');
      return null; // Early exit.
    }

    const args = [
      srcBigNumber,
      dstMinBigNumber,
      internalTransactions,
      wallet.address,
      Date.now() + 1000 * 60 * 2, // 2 minutes
    ];

    return contract.swapExactTokensForTokens(...args, {gasPrice: 7000000000000});
  });

  return [srcBigNumberValue, dstMinBigNumberValue];
};
