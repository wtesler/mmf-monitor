module.exports = async (srcToken, dstToken, srcInBigNumber, wallet) => {
  const dexScreenerClient = require('../../../dexscreener/client/DexScreenerClient');
  const swapTokens = require('../swapTokens');
  const TokenAddresses = require("../../../constants/TokenAddresses");
  const TokenDecimals = require("../../../constants/TokenDecimals");
  const NetworkNames = require("../../../constants/NetworkNames");

  const ACTION = `SWAP BASIC`;

  console.log(`${ACTION} | TOKENS: ${srcToken} / ${dstToken}`);

  const parameterFunction = async() => {
    let address = TokenAddresses[`${srcToken}_${dstToken}`];
    if (!address) {
      address = TokenAddresses[`${dstToken}_${srcToken}`];
    }
    const pairInfo = await dexScreenerClient.readPairInfo(NetworkNames.CRONOS, address);
    const pair = pairInfo.pair;
    const quoteToken = pair.quoteToken.symbol;
    const baseToken = pair.baseToken.symbol;
    const liquidity = pair.liquidity;
    const lQuote = liquidity.quote;
    const lBase = liquidity.base;
    // console.log(`${quoteToken}, ${baseToken}, ${lQuote}, ${lBase}`)
    const isQuoteSrc = quoteToken === srcToken;
    const priceNative = (isQuoteSrc ? lBase : lQuote) / (isQuoteSrc ? lQuote : lBase);

    const slippage = .998;
    let roundingNum;
    let decimalAdjustment = Math.pow(10, TokenDecimals[dstToken]) / Math.pow(10, TokenDecimals[srcToken]);
    if (decimalAdjustment < 1) {
      roundingNum = Math.floor(1 / decimalAdjustment);
      decimalAdjustment = 1;
      console.log(roundingNum);
    } else {
      roundingNum = 1;
    }

    console.log(decimalAdjustment);

   //  const dstOutMinBigNumber = '0x0';
    const dstOutMinBigNumber = srcInBigNumber
      .mul(decimalAdjustment)
      .div(roundingNum)
      .mul(Math.floor(slippage * priceNative * 10000))
      .div(10000)

    console.log(`${ACTION} | Swapping ${srcInBigNumber.toString()} ${srcToken} for atleast ${dstOutMinBigNumber.toString()} ${dstToken}.`);

    const internalTransactions = [
      TokenAddresses[srcToken], TokenAddresses[dstToken]
    ];

    return [srcInBigNumber, dstOutMinBigNumber, internalTransactions];
  };

  await swapTokens(parameterFunction, wallet);

  console.log(`${ACTION} | SUCCESS`);
};
