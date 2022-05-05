module.exports = async (pairTokenName, provider) => {
  const {ethers} = require("ethers");
  const pairAbi = require("../contracts/abis/meerkat_pair_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");
  const TokenNames = require("../../constants/TokenNames");

  const tokenAddress = TokenAddresses[pairTokenName];
  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairTokenName);

  const response = {[tokenA]: 0, [tokenB]: 0};

  const contract = new ethers.Contract(tokenAddress, pairAbi, provider);

  const quoteAddress = await contract.token0();
  const baseAddress = await contract.token1();

  const reserves = await contract.getReserves();
  const quoteReserve = reserves[0];
  const baseReserve = reserves[1];

  const isTokenAQuote = TokenAddresses.AreAddressesEqual(quoteAddress, TokenAddresses[tokenA]);

  response[tokenA] = isTokenAQuote ? quoteReserve : baseReserve;
  response[tokenB] = isTokenAQuote ? baseReserve : quoteReserve;

  return response;
};
