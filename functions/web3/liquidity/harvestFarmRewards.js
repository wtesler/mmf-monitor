/**
 * harvest the rewards from the farm.
 *
 * @param pairTokenName The LP token name.
 * @param wallet
 */
module.exports = async (pairTokenName, wallet) => {
  const {ethers} = require("ethers");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const StakeContractPids = require("../../constants/StakeContractPids");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const masterAbi = require("../contracts/abis/meerkat_master_abi.json");

  const ACTION = `HARVESTING`;

  console.log(`${ACTION} | ${pairTokenName}`);

  await resilientTransact(async () => {
    const contract = new ethers.Contract(ContractAddresses.MASTER_MEERKAT, masterAbi, wallet);

    const contractPid = StakeContractPids[pairTokenName];
    const referrer = '0x0000000000000000000000000000000000000000';
    const amount = '0x0';

    const args = [contractPid, amount, referrer];

    return contract.deposit(...args, {gasPrice: 7000000000000});
  });

  console.log(`${ACTION} | SUCCESS`);
};
