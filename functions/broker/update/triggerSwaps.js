module.exports = async (srcPool, dstPool) => {
  const directClient = await require('../../direct/DirectClient');
  const {reportError} = require("google-cloud-report-error");

  try {
    await directClient.swapStakedPools(srcPool, dstPool);
  } catch (e) {
    // Attempting a call to the cloud functions has failed in the background.
    reportError(e);
  }
};
