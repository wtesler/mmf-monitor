/**
 * Unstake the max liquidity of the LP token.
 *
 * @param pairTokenName The LP token name.
 * @param wallet
 * @return didStakeExist true if stake existed, false if no stake existed.
 */
module.exports = async (pairTokenName, wallet) => {
  const {ethers} = require("ethers");
  const StakeContractPids = require("../../constants/StakeContractPids");
  const readStakedBalance = require("../../web3/token/readStakedBalance");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const masterAbi = require("../contracts/abis/meerkat_master_abi.json");

  const ACTION = `UNSTAKING`;

  console.log(`${ACTION} | ${pairTokenName}`);

  // Will return a falsy value if unstaking was not required.
  const tx = await resilientTransact(async () => {
    const pairTokenBalanceBigNumber = await readStakedBalance(pairTokenName, wallet);

    console.log(`${ACTION} | Balance: ${pairTokenBalanceBigNumber.toString()} ${pairTokenName}`);

    if (pairTokenBalanceBigNumber.isZero()) {
      console.log(`${ACTION} | NO UNSTAKING REQUIRED`);
      return null; // NOOP
    }

    const contractPid = StakeContractPids[pairTokenName];
    const contract = new ethers.Contract(ContractAddresses.MASTER_MEERKAT, masterAbi, wallet);

    const args = [contractPid, pairTokenBalanceBigNumber];

    return contract.withdraw(...args, {gasPrice: 7000000000000});
  });

  console.log(`${ACTION} | SUCCESS`);

  return Boolean(tx);
};
