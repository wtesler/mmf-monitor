/**
 * Be careful calling this out-of-schedule.
 */
(async () => {
  const brokerStep = require("../brokerStep");
  await brokerStep();
})();
