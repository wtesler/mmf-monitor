module.exports = async (tokenName, wallet, shouldReturnBigNumber=false) => {
  const FormatToken = require("../../constants/FormatToken");
  const TokenNames = require("../../constants/TokenNames");

  let balance;
  if (tokenName === TokenNames.CRO) {
    balance = await wallet.provider.getBalance(wallet.address);
  } else {
    balance = await readErc20Balance(tokenName, wallet);
    if (balance.isZero()) {
      // Try again if balance was zero just in case it needed time to update.
      await new Promise(resolve => setTimeout(resolve, 5000)); // Sleep
      balance = await readErc20Balance(tokenName, wallet);
    }
  }

  if (shouldReturnBigNumber) {
    return balance;
  } else {
    return FormatToken.formatUnits(tokenName, balance);
  }
};

async function readErc20Balance(tokenName, wallet) {
  const {ethers} = require("ethers");
  const genericAbi = require("./abis/generic_erc20_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[tokenName];

  const contract = new ethers.Contract(tokenAddress, genericAbi, wallet);

  const balance = await contract.balanceOf(wallet.address);

  return balance;
}
