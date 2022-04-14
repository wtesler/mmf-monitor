(async () => {
  const updateBrokerHistory = require("../updateBrokerHistory");
  const PairNames = require("../../../constants/PairNames");

  try {
    const history = await updateBrokerHistory(PairNames.MMF_CRO, 8);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
