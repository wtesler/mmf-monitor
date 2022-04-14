(async () => {
  const updateBrokerHistory = require("../updateBrokerHistory");
  const TokenNames = require("../../../constants/TokenNames");

  try {
    const history = await updateBrokerHistory(TokenNames.MMF_USDC, 8);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
