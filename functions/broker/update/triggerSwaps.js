module.exports = async (signal, srcPool, dstPool, walletData) => {
  const directClient = await require('../../direct/DirectClient');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');
  const {reportError} = require("google-cloud-report-error");

  const {mnemonic, email} = walletData;

  let signalMessage = signal;
  if (signal === 'SELL') {
    signalMessage = 'BEAR';
  } else if (signal === 'BUY') {
    signalMessage = 'BULL';
  }

  try {
    // No need to await the sending of the email.
    // noinspection ES6MissingAwait
    sendInBlueClient.sendEmail(email, 4, {
      signal: signalMessage,
      srcPool: srcPool,
      dstPool: dstPool
    });

    await directClient.swapStakedPools(srcPool, dstPool, mnemonic, email);
  } catch (e) {
    // Attempting a call to the cloud functions has failed in the background.
    reportError(e);
  }
};
