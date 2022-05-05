module.exports = async (pairTokenName, wallet) => {
  const readTokenBalance = require('../token/readTokenBalance');
  const {ethers} = require("ethers");
  const pairAbi = require("./abis/meerkat_pair_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");

  const tokenAddress = TokenAddresses[pairTokenName];
  const tokens = pairTokenName.split('_');
  const tokenA = tokens[0];
  const tokenB = tokens[1];

  const response = {[tokenA]: 0, [tokenB]: 0};

  const contract = new ethers.Contract(tokenAddress, pairAbi, wallet.provider);

  const totalSupplyBigNumber = await contract.totalSupply();
  const tokenBalanceBigNumber = await readTokenBalance(pairTokenName, wallet);

  if (tokenBalanceBigNumber.isZero()) {
    return response;
  }

  const quoteAddress = await contract.token0();
  const baseAddress = await contract.token1();

  const reserves = await contract.getReserves();
  const quoteReserve = reserves[0];
  const baseReserve = reserves[1];

  const isTokenAQuote = quoteAddress.toLowerCase() === TokenAddresses[tokenA].toLowerCase();

  response[tokenA] = isTokenAQuote ? quoteReserve : baseReserve;
  response[tokenB] = isTokenAQuote ? baseReserve : quoteReserve;

  const ownership = totalSupplyBigNumber.div(tokenBalanceBigNumber);

  for (const key of Object.keys(response)) {
    response[key] = response[key].div(ownership);
  }

  return response;
};
