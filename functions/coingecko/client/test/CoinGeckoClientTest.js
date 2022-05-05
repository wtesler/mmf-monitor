(async () => {
  const coinGeckoClient = await require('../CoinGeckoClient');
  const CoinGeckoNames = require('../../../constants/CoinGeckoNames');

  const response = await coinGeckoClient.readPrice(CoinGeckoNames.MMF, CoinGeckoNames.MUSD);
  console.log(response);
})();
