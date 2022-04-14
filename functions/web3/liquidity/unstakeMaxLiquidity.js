module.exports = async (pairTokenName, wallet) => {
  const {ethers} = require("ethers");
  const FormatToken = require("../../constants/FormatToken");
  const StakeContractAddresses = require("../../constants/StakeContractAddresses");
  const StakeContractAbis = require("../../constants/StakeContractAbis");
  const StakeContractPids = require("../../constants/StakeContractPids");
  const readStakedBalance = require("../../web3/token/readStakedBalance");
  const resilientTransact = require("../../web3/transact/resilientTransact");

  const ACTION = `UNSTAKING`;

  console.log(`${ACTION} | ${pairTokenName}`);

  const pairTokenBalance = await readStakedBalance(pairTokenName, wallet);
  const pairTokenFormmattedBalance = FormatToken.formatToken(pairTokenName, pairTokenBalance);

  console.log(`${ACTION} | Balance of ${pairTokenBalance}`);

  const contractAddress = StakeContractAddresses[pairTokenName];
  const contractAbi = StakeContractAbis[pairTokenName];
  const contractPid = StakeContractPids[pairTokenName];
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

  await resilientTransact(async () => {
    return contract.withdraw(contractPid, pairTokenFormmattedBalance);
  });

  console.log(`${ACTION} | SUCCESS`);
};
