(async () => {
  const updateBrokerHistory = require("../updateBrokerHistory");
  try {
    const history = await updateBrokerHistory('MMF_WCRO', 8);
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
