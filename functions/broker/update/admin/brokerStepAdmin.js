/**
 * Be careful calling this out-of-schedule.
 */
(async () => {
  const brokerStep = require("../brokerStep");
  try {
    await brokerStep();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
