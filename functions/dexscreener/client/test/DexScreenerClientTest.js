(async () => {
  const dexScreenerClient = await require('../DexScreenerClient');
  const TokenAddresses = require('../../../constants/TokenAddresses');
  const NetworkNames = require('../../../constants/NetworkNames');

  const pairInfo = await dexScreenerClient.readPairInfo(TokenAddresses.MUSD_USDC);
  // console.log(pairInfo);

  const pair = pairInfo.pair;
  const liquidity = pair.liquidity;
  const quoteToken = pair.quoteToken.symbol;
  const baseToken = pair.baseToken.symbol;
  const priceNative = liquidity.quote / liquidity.base;
  const priceNativeFromStr = Number(pair.priceNative);

  console.log(pair);
  console.log(liquidity);
  console.log(quoteToken);
  console.log(baseToken);
  console.log(priceNative);
  console.log(priceNativeFromStr);
})();
