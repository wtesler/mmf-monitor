module.exports = async (pairTokenName, provider) => {
  const readLiquidity = require('./readLiquidity');
  const FixedNumberUtils = require('../../numbers/FixedNumberUtils');
  const TokenNames = require("../../constants/TokenNames");

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairTokenName);

  const response = await readLiquidity(pairTokenName, provider);

  response[tokenA] = FixedNumberUtils.AdjustToDecimals(tokenA, tokenB, response[tokenA]);

  return FixedNumberUtils.Divide(response[tokenB], response[tokenA]);
};
