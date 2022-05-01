module.exports = async (tokenName, wallet) => {
  const TokenNames = require("../../constants/TokenNames");

  let balanceBigNumber;
  if (tokenName === TokenNames.CRO) {
    balanceBigNumber = await wallet.provider.getBalance(wallet.address);
  } else {
    balanceBigNumber = await readErc20Balance(tokenName, wallet);
    if (balanceBigNumber.isZero()) {
      console.warn('Balance was zero so trying again.');
      // Try again if balance was zero just in case it needed time to update.
      await new Promise(resolve => setTimeout(resolve, 5000)); // Sleep
      balanceBigNumber = await readErc20Balance(tokenName, wallet);
    }
  }

  return balanceBigNumber;
};

async function readErc20Balance(tokenName, wallet) {
  const {ethers} = require("ethers");
  const erc20Abi = require("./abis/generic_erc20_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[tokenName];

  const contract = new ethers.Contract(tokenAddress, erc20Abi, wallet.provider);

  const balanceBigNumber = await contract.balanceOf(wallet.address);

  return balanceBigNumber;
}
