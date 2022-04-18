(async () => {
  const dexScreenerClient = await require('../DexScreenerClient');
  const TokenAddresses = require('../../../constants/TokenAddresses');
  const NetworkNames = require('../../../constants/NetworkNames');

  const pairInfo = await dexScreenerClient.readPairInfo(NetworkNames.CRONOS, TokenAddresses.USDC_USDT);
  console.log(pairInfo);
})();
