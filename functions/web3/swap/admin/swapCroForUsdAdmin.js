(async () => {
  const swapCroForUsd = require("../swapCroForUsd");
  try {
    await swapCroForUsd();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
