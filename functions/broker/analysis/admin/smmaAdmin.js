(async () => {
  const smma = require("../smma");
  const readBrokerHistory = require("../../../broker/read/readBrokerHistory");
  const history = await readBrokerHistory('MMF_USDC');
  const value = smma(history.prices, 120);
  const value2 = smma(history.prices, 20);
  console.log(value);
  console.log(value2);
})();
