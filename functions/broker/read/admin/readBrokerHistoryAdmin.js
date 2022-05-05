(async () => {
  const readBrokerHistory = require("../readBrokerHistory");
  const TokenNames = require("../../../constants/TokenNames");
  const history = await readBrokerHistory(TokenNames.MMF_USDC);
  console.log(history);
})();
