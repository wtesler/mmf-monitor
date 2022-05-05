module.exports = async (pairTokenName, wallet) => {
  const {ethers, BigNumber} = require("ethers");
  const readTokenBalance = require('../token/readTokenBalance');
  const readLiquidity = require('./readLiquidity');
  const pairAbi = require("./abis/meerkat_pair_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[pairTokenName];

  const response = await readLiquidity(pairTokenName, wallet);

  const contract = new ethers.Contract(tokenAddress, pairAbi, wallet.provider);
  const totalSupplyBigNumber = await contract.totalSupply();
  const tokenBalanceBigNumber = await readTokenBalance(pairTokenName, wallet);

  if (tokenBalanceBigNumber.isZero()) {
    for (const key of Object.keys(response)) {
      response[key] = BigNumber.from('0x0');
    }
    return response;
  }

  const ownership = totalSupplyBigNumber.div(tokenBalanceBigNumber);

  for (const key of Object.keys(response)) {
    response[key] = response[key].div(ownership);
  }

  return response;
};
