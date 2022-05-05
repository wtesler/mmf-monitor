module.exports = async (pairTokenName, wallet) => {
  const {ethers} = require("ethers");
  const TokenAddresses = require("../../constants/TokenAddresses");
  const TokenNames = require("../../constants/TokenNames");
  const readTokenBalance = require("../token/readTokenBalance");
  const readNativePrice = require("../token/readNativePrice");
  const resilientTransact = require("../transact/resilientTransact");
  const FixedNumberUtils = require("../../numbers/FixedNumberUtils");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const routerAbi = require("../contracts/abis/meerkat_router_abi.json");

  const ACTION = `CREATING MAX LIQUIDITY`;

  console.log(`${ACTION} | ${pairTokenName}`);

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairTokenName);

  await resilientTransact(async () => {
    const priceNative = await readNativePrice(pairTokenName, wallet);

    const tokenAPromise = readTokenBalance(tokenA, wallet);
    const tokenBPromise = readTokenBalance(tokenB, wallet);

    let [tokenABalance, tokenBBalance] = await Promise.all([tokenAPromise, tokenBPromise]);

    console.log(`${ACTION} | WE HAVE ${tokenABalance.toString()} ${tokenA} AND ${tokenBBalance.toString()} ${tokenB}`);

    if (tokenABalance.isZero() || tokenBBalance.isZero()) {
      throw new Error('Possibly did not pull balances properly. Trying again.');
    }

    const adjustedABalance = FixedNumberUtils.Multiply(tokenABalance, priceNative);

    const tokenPercentage = FixedNumberUtils.Divide(adjustedABalance, tokenBBalance);

    const tokenPercentageFloat = tokenPercentage.toUnsafeFloat();

    if (tokenPercentageFloat < .7 || tokenPercentageFloat > 1.3) {
      throw new Error('Possibly did not pull balances properly. Trying again.');
    }

    if (tokenPercentageFloat < 1) {
      // We reduce base amount because RHS must be smaller than LHS.
      tokenBBalance = FixedNumberUtils.Multiply(tokenBBalance, tokenPercentage);
    }

    const slippage = 0.995;
    const tokenAFixedNumberMin = FixedNumberUtils.Multiply(tokenABalance, slippage);
    const tokenBFixedNumberMin = FixedNumberUtils.Multiply(tokenBBalance, slippage);

    const tokenABigNumber = FixedNumberUtils.NumberToBigNumber(tokenABalance);
    const tokenBBigNumber = FixedNumberUtils.NumberToBigNumber(tokenBBalance);

    const tokenABigNumberMin = FixedNumberUtils.NumberToBigNumber(tokenAFixedNumberMin);
    const tokenBBigNumberMin = FixedNumberUtils.NumberToBigNumber(tokenBFixedNumberMin);

    const addressA = TokenAddresses[tokenA];
    const addressB = TokenAddresses[tokenB];

    // console.log(`${ACTION} | ${quoteNumber.toString()}, ${baseNumber.toString()}, ${quoteBigNumberMin.toString()}, ${baseBigNumberMin.toString()}`);

    const contract = new ethers.Contract(ContractAddresses.ROUTER_MEERKAT, routerAbi, wallet);

    const args = [
      addressA,
      addressB,
      tokenABigNumber,
      tokenBBigNumber,
      tokenABigNumberMin,
      tokenBBigNumberMin,
      wallet.address,
      Date.now() + 1000 * 60 * 2, // 2 minutes
    ];

    return contract.addLiquidity(...args, {gasPrice: 7000000000000});
  });

  console.log(`${ACTION} | SUCCESS`);
};
