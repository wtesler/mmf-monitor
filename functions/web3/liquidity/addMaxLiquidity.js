module.exports = async (tokenA, tokenB, wallet) => {
  const addLiquidity = require("./addLiquidity");
  const FormatToken = require("../../constants/FormatToken");
  const readTokenBalance = require("../../web3/token/readTokenBalance");

  const ACTION = `ADDING MAX LIQUIDITY`;

  console.log(`${ACTION} | ${tokenA}_${tokenB}`);

  const tokenABalance = await readTokenBalance(tokenA, wallet);
  const tokenBBalance = await readTokenBalance(tokenB, wallet);

  console.log(`${ACTION} | BALANCES: [${tokenABalance}, ${tokenBBalance}]`);

  const tokenAMinAmount = tokenABalance * 0.99;
  const tokenBMinAmount = tokenBBalance * 0.99;

  const tokenAFormmattedBalance = FormatToken.formatToken(tokenA, tokenABalance);
  const tokenBFormmattedBalance = FormatToken.formatToken(tokenB, tokenBBalance);

  const tokenAFormmattedMin = FormatToken.formatToken(tokenA, tokenAMinAmount);
  const tokenBFormmattedMin = FormatToken.formatToken(tokenB, tokenBMinAmount);

  await addLiquidity(
    tokenA,
    tokenB,
    tokenAFormmattedBalance,
    tokenBFormmattedBalance,
    tokenAFormmattedMin,
    tokenBFormmattedMin,
    wallet);

  console.log(`${ACTION} | SUCCESS`);
};
