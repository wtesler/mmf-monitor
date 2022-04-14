(async () => {
  const readBrokerHistory = require("../readBrokerHistory");
  const PairNames = require("../../../constants/PairNames");
  try {
    const history = await readBrokerHistory(PairNames.MMF_CRO);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
