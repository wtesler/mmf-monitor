/**
 * Be careful calling this out-of-schedule.
 */
(async () => {
  const compounderStep = require("../compounderStep");
  await compounderStep();
})();
