module.exports = async (tokenName, wallet) => {
  const {ethers} = require("ethers");
  const StakeContractPids = require("../../constants/StakeContractPids");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const masterAbi = require("../contracts/abis/meerkat_master_abi.json");

  const contract = new ethers.Contract(ContractAddresses.MASTER_MEERKAT, masterAbi, wallet);

  const pid = StakeContractPids[tokenName];

  let balanceBigNumber = await readBalance(contract, pid, wallet);

  // TODO: Why is this necessary? Why does balance not update properly sometimes?
  if (balanceBigNumber.isZero()) {
    console.warn(`READ STAKED BALANCE | STAKED BALANCE WAS ZERO. TRYING AGAIN.`);
    await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep / Settle
    balanceBigNumber = await readBalance(contract, pid, wallet);
  }

  return balanceBigNumber;
};

async function readBalance(contract, pid, wallet) {
  const userInfo = await contract.userInfo(pid, wallet.address);

  const balanceBigNumber = userInfo.amount;

  // const rewardDebt = userInfo.rewardDebt;

  return balanceBigNumber;
}
