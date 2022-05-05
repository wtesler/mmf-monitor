/**
 * @deprecated Not in use and might be antiquated.
 */
module.exports = async (srcBigNumber, dstMinBigNumber, internalTransactions, wallet) => {
  const {ethers} = require("ethers");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const routerAbi = require("../contracts/abis/meerkat_router_abi.json");

  const contract = new ethers.Contract(ContractAddresses.ROUTER_MEERKAT, routerAbi, wallet);

  await resilientTransact(async () => {
    return contract.swapExactETHForTokens(
      dstMinBigNumber,
      internalTransactions,
      wallet.address,
      Date.now() + 1000 * 60 * 2, // 2 minutes
      {
        value: srcBigNumber,
        gasPrice: 7000000000000
      }
    );
  });
};
