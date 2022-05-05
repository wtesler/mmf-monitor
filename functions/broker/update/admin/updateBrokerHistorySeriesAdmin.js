(async () => {
  const updateBrokerHistorySeries = require("../updateBrokerHistorySeries");
  const TokenNames = require("../../../constants/TokenNames");
  const history = await updateBrokerHistorySeries(TokenNames.MMF_MUSD, 'prices', 0.5896116928115335);
  console.log(history);
})();
