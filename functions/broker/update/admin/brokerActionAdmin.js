(async () => {
  const brokerTiming = require("../brokerAction");
  // const results = brokerTiming(['NONE', 'SELL', 'NONE', 'NONE', 'NONE', 'BUY', 'NONE', 'NONE']);
  const results = brokerTiming(['SELL', 'NONE', 'NONE', 'NONE', 'NONE', 'BUY', 'NONE', 'NONE', 'NONE']);

  console.log(results);
})();
