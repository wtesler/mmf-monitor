module.exports = async (pairAddress, wallet) => {
  const readTokenBalance = require('../../token/readTokenBalance');
  const swapTokens = require('../swapTokens');
  const DexScreenerClient = require('../../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require("../../../constants/NetworkNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const ACTION = `CREATING EQUAL LIQUIDITY`;

  const parameterFunction = async() => {
    const pairInfo = await DexScreenerClient.readPairInfo(NetworkNames.CRONOS, pairAddress);
    const pair = pairInfo.pair;
    const quoteToken = pair.quoteToken.symbol;
    const baseToken = pair.baseToken.symbol;
    const priceNative = pair.liquidity.quote / pair.liquidity.base;
    const priceRatio = 1 / priceNative;

    console.log(`${ACTION} | TOKENS: ${quoteToken} / ${baseToken}`);

    console.log(`${ACTION} | PRICE RATIO: ${priceRatio}`);

    const quotePromise = readTokenBalance(quoteToken, wallet);
    const basePromise = readTokenBalance(baseToken, wallet);

    const [quoteBigNumber, baseBigNumber] = await Promise.all([quotePromise, basePromise]);

    console.log(`${ACTION} | WE HAVE ${quoteBigNumber} ${quoteToken} AND ${baseBigNumber} ${baseToken}`);

    const basedQuoteNumber = quoteBigNumber.mul(Math.floor(priceRatio * 10000)).div(10000);

    const tokenPercentage = basedQuoteNumber.mul(10000).div(baseBigNumber);

    if (tokenPercentage.lt(9900) || tokenPercentage.gt(11000)) {
      console.log(`${ACTION} | TOKEN RATIO CLOSE ENOUGH. NO SWAPS NEEDED.`);
      return [null, null, null]; // Early exit.
    }
    const getInOrOutValues = (shouldGetQuoteValues) => {
      const basedDifference = basedQuoteNumber.sub(baseBigNumber);
      const basedMiddleDifference = basedDifference.div(2);

      const token = shouldGetQuoteValues ? quoteToken : baseToken;
      const debaseMult = shouldGetQuoteValues ? (1 / priceRatio) : 1;

      const swapAmountBigNumber = basedMiddleDifference.mul(debaseMult).abs();

      const address = TokenAddresses[shouldGetQuoteValues ? quoteToken : baseToken];

      return [token, swapAmountBigNumber, address];
    };

    const [inToken, inSwapBigNumber, inAddress] = getInOrOutValues(tokenPercentage > 100);
    const [outToken, outSwapBigNumber, outAddress] = getInOrOutValues(tokenPercentage <= 100);

    const outSwapBigNumberMin = outSwapBigNumber.mul(10000).div(9980); // Slippage

    console.log(`${ACTION} | SWAPPING ${inSwapBigNumber} ${inToken} for atleast ${outSwapBigNumberMin} ${outToken}.`);

    const internalTransactions = [
      inAddress, outAddress
    ];

    return [inSwapBigNumber, outSwapBigNumberMin, internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);
};
