(async () => {
  const updateBrokerHistorySeries = require("../updateBrokerHistorySeries");
  const TokenNames = require("../../../constants/TokenNames");
  const history = await updateBrokerHistorySeries(TokenNames.MMF_USDC, 'points', 8);
  console.log(history);
})();
