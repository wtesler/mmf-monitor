module.exports = async (pairTokenName, provider, alignAddresses = true) => {
  const {ethers} = require("ethers");
  const pairAbi = require("../contracts/abis/meerkat_pair_abi.json");
  const TokenAddresses = require("../../constants/TokenAddresses");
  const TokenNames = require("../../constants/TokenNames");

  const tokenAddress = TokenAddresses[pairTokenName];
  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairTokenName);

  const response = {[tokenA]: 0, [tokenB]: 0};

  const contract = new ethers.Contract(tokenAddress, pairAbi, provider);

  let quoteAddress;
  let reserves;

  const readInfo = async () => {
    [quoteAddress, reserves] = await Promise.all([
      alignAddresses ? contract.token0() : Promise.resolve('unused'),
      contract.getReserves()
    ]);
  };

  try {
    await readInfo();
  } catch (e) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Sleep
    // Try a second time for good luck (and resilience).
    await readInfo();
  }

  // console.log(reserves[0].toString());
  // console.log(reserves[1].toString());

  const quoteReserve = reserves[0];
  const baseReserve = reserves[1];

  const isTokenAQuote = alignAddresses ?
    TokenAddresses.AreAddressesEqual(quoteAddress, TokenAddresses[tokenA])
    : true;

  response[tokenA] = isTokenAQuote ? quoteReserve : baseReserve;
  response[tokenB] = isTokenAQuote ? baseReserve : quoteReserve;

  return response;
};
