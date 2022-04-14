(async () => {
  const readBrokerHistory = require("../readBrokerHistory");
  const TokenNames = require("../../../constants/TokenNames");
  try {
    const history = await readBrokerHistory(TokenNames.MMF_USDC);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
