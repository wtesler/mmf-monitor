module.exports = async (walletData) => {
  const directClient = await require('../../direct/DirectClient');
  const {reportError} = require("google-cloud-report-error");

  try {
    await directClient.harvestRewardAndRestake(walletData);
  } catch (e) {
    // Attempting a call to the cloud functions has failed in the background.
    reportError(e);
  }
};
