(async () => {
  const updateBrokerHistorySeries = require("../updateBrokerHistorySeries");
  const TokenNames = require("../../../constants/TokenNames");

  try {
    const history = await updateBrokerHistorySeries(TokenNames.MMF_USDC, 'points', 8);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
