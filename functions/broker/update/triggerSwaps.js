module.exports = async (signal, srcPool, dstPool, price, walletData) => {
  const directClient = await require('../../direct/DirectClient');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const {reportError} = require("google-cloud-report-error");

  try {
    const {mnemonic, email} = walletData;

    // No need to await the sending of the email.
    // noinspection ES6MissingAwait
    sendInBlueClient.sendEmail(email, 4, {
      signal: signal,
      srcPool: srcPool,
      dstPool: dstPool,
      price: price
    });

    await directClient.swapStakedPools(srcPool, dstPool, mnemonic, email, signal);
  } catch (e) {
    // Attempting a call to the cloud functions has failed in the background.
    reportError(e);
  }
};
