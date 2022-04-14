(async () => {
  const dexScreenerClient = require('../DexScreenerClient');
  const TokenAddresses = require('../../../constants/TokenAddresses');
  const NetworkNames = require('../../../constants/NetworkNames');

  const response = await dexScreenerClient.readPairInfo(NetworkNames.CRONOS, TokenAddresses.MMF_USDC);

  console.log(response);
})();
