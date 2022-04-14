(async () => {
  const readBrokerHistory = require("../readBrokerHistory");
  try {
    const history = await readBrokerHistory('MMF_WCRO');
    console.log(history);
  } catch (e) {
    console.error(e);
  }
})();
