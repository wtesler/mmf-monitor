module.exports = async (pairTokenName, wallet) => {
  const {ethers} = require("ethers");
  const StakeContractPids = require("../../constants/StakeContractPids");
  const readTokenBalance = require("../../web3/token/readTokenBalance");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const masterAbi = require("../contracts/abis/meerkat_master_abi.json");

  const ACTION = `STAKING`;

  console.log(`${ACTION} | ${pairTokenName}`);

  await resilientTransact(async () => {
    const pairBigNumber = await readTokenBalance(pairTokenName, wallet);

    console.log(`${ACTION} | Balance of ${pairBigNumber.toString()}`);

    if (pairBigNumber.isZero()) {
      throw new Error('Possibly did not pull balances properly. Trying again.');
    }

    const contractPid = StakeContractPids[pairTokenName];

    const contract = new ethers.Contract(ContractAddresses.MASTER_MEERKAT, masterAbi, wallet);

    const args = [contractPid, pairBigNumber, '0x0000000000000000000000000000000000000000'];

    return contract.deposit(...args, {gasPrice: 7000000000000});
  });

  console.log(`${ACTION} | SUCCESS`);
};
