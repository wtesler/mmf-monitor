(async () => {
  const dexScreenerClient = require('../DexScreenerClient');
  const PairAddresses = require('../../../constants/PairAddresses');
  const NetworkNames = require('../../../constants/NetworkNames');

  const response = await dexScreenerClient.readPairInfo(NetworkNames.CRONOS, PairAddresses.MMF_CRO);

  console.log(response);
})();
