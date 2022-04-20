module.exports = async (pairAddress, wallet) => {
  const readTokenBalance = require('../../token/readTokenBalance');
  const swapTokens = require('../swapTokens');
  const DexScreenerClient = require('../../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require("../../../constants/NetworkNames");
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const TokenDecimals = require("../../../constants/TokenDecimals");
  const FormatToken = require("../../../constants/FormatToken");

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

    const [quoteAmount, baseAmount] = await Promise.all([quotePromise, basePromise]);

    console.log(`${ACTION} | WE HAVE ${quoteAmount} ${quoteToken} AND ${baseAmount} ${baseToken}`);

    const basedQuoteAmount = quoteAmount * priceRatio;

    const tokenRatio = baseAmount ? basedQuoteAmount / baseAmount : 9999999999;

    if (tokenRatio > 0.99 && tokenRatio < 1.01) {
      console.log(`${ACTION} | TOKEN RATIO CLOSE ENOUGH. NO SWAPS NEEDED.`);
      return [null, null, null]; // Early exit.
    }

    const getInOrOutValues = (shouldGetQuoteValues) => {
      const basedDifference = basedQuoteAmount - baseAmount;
      const basedMiddleDifference = basedDifference / 2;

      const token = shouldGetQuoteValues ? quoteToken : baseToken;
      const debaseMult = shouldGetQuoteValues ? (1 / priceRatio) : 1;

      let swapAmount = Math.abs(basedMiddleDifference * debaseMult);
      swapAmount = Number(FormatToken.toFixedDecimals(swapAmount, TokenDecimals[token]));

      const address = TokenAddresses[shouldGetQuoteValues ? quoteToken : baseToken];

      return [token, swapAmount, address];
    };

    const [inToken, inSwapAmount, inAddress] = getInOrOutValues(tokenRatio > 1);
    const [outToken, outSwapAmount, outAddress] = getInOrOutValues(tokenRatio <= 1);

    let outAmountMin = outSwapAmount * 0.99; // Slippage
    outAmountMin = FormatToken.toFixedDecimals(outAmountMin, TokenDecimals[outToken]);

    console.log(`${ACTION} | SWAPPING ${inSwapAmount} ${inToken} for atleast ${outAmountMin} ${outToken}.`);

    const formattedInAmount = FormatToken.formatToken(inToken, inSwapAmount);
    const formattedOutAmountMin = FormatToken.formatToken(outToken, outAmountMin);

    const internalTransactions = [
      inAddress, outAddress
    ];

    return [formattedInAmount, formattedOutAmountMin, internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);
};
