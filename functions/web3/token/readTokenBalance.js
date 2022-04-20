module.exports = async (tokenName, wallet) => {
  const FormatToken = require("../../constants/FormatToken");
  const TokenNames = require("../../constants/TokenNames");

  let balanceNum;
  if (tokenName === TokenNames.CRO) {
    const balance = await wallet.provider.getBalance(wallet.address);
    balanceNum = Number(balance.toString());
  } else {
    balanceNum = await readErc20Balance(tokenName, wallet);

    // TODO: Why is this necessary? Why does balance not update properly sometimes?
    if (balanceNum === 0) {
      console.warn(`READ TOKEN BALANCE | TOKEN BALANCE WAS ZERO. TRYING AGAIN.`);
      await new Promise(resolve => setTimeout(resolve, 20000)); // Sleep / Settle
      balanceNum = await readErc20Balance(tokenName, wallet);
    }
  }

  const balanceParsed = FormatToken.parseToken(tokenName, balanceNum);

  return balanceParsed;
};

async function readErc20Balance(tokenName, wallet) {
  const {ethers} = require("ethers");
  const genericAbi = require("./abis/generic_erc20_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[tokenName];

  const contract = new ethers.Contract(tokenAddress, genericAbi, wallet);

  // TODO: Why does calling this twice make it more consistent?
  // noinspection JSUnusedAssignment
  let balance = await contract.balanceOf(wallet.address);
  balance = await contract.balanceOf(wallet.address);

  const balanceNum = Number(balance.toString());

  return balanceNum;
}
