(async () => {
  const updateBrokerActionTimes = require("../updateBrokerActionTimes");
  await updateBrokerActionTimes('MMF_USDC', 'SELL', 2, 'BUY');
  console.log('success');
})();
