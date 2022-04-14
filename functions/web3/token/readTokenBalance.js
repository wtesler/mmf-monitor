module.exports = async (tokenName, wallet) => {
  const FormatToken = require("../../constants/FormatToken");
  const TokenNames = require("../../constants/TokenNames");

  let balance;
  if (tokenName === TokenNames.CRO) {
    balance = await wallet.provider.getBalance(wallet.address);
  } else {
    balance = await readErc20Balance(tokenName, wallet);
  }

  const balanceNum = Number(balance.toString());

  const balanceParsed = FormatToken.parseToken(tokenName, balanceNum);

  return balanceParsed;
};

async function readErc20Balance(tokenName, wallet) {
  const {ethers} = require("ethers");
  const genericAbi = require("./generic_erc20_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[tokenName];

  const contract = new ethers.Contract(tokenAddress, genericAbi, wallet);
  const balance = await contract.balanceOf(wallet.address);
  return balance;
}
