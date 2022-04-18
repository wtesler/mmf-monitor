(async () => {
  const dexScreenerClient = await require('../DexScreenerClient');
  const TokenAddresses = require('../../../constants/TokenAddresses');
  const NetworkNames = require('../../../constants/NetworkNames');

  const pairInfo = await dexScreenerClient.readPairInfo(NetworkNames.CRONOS, TokenAddresses.MMF_USDC);
  console.log(pairInfo);
})();
