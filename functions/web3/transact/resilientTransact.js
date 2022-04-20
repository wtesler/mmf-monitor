/**
 * Try the transaction a few times with a pause in-between.
 *
 * @param transactionAction An function which returns a pending transaction.
 */
module.exports = async (transactionAction) => {
  const TOTAL_ATTEMPTS = 6;

  let numAttempts = 0;
  let error;

  while (numAttempts < TOTAL_ATTEMPTS) {
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 60000, 'timeout')); // 1 minute.

      const tx = await Promise.race([transactionAction(), timeoutPromise]);

      if (tx === 'timeout') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('TIMEOUT WAITING FOR TRANSACTION');
      }

      if (tx === null) {
        return false; // Transaction Action was a NOOP.
      }

      const awaitedTx = await tx.wait();

      // console.log(awaitedTx);

      if (awaitedTx.code === 'CALL_EXCEPTION') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(awaitedTx.reason); // It is intended that this is caught locally.
      }

      return awaitedTx;
    } catch (e) {
      error = e;
      numAttempts++;
      if (numAttempts < TOTAL_ATTEMPTS) {
        console.warn(`TRANSACTION FAILED. TRYING AGAIN AFTER PAUSE.`);
        if (e.code === 'CALL_EXCEPTION') {
          console.warn(e.reason);
        } if (e.code === 'SERVER_ERROR') {
          console.warn(e.reason);
          console.warn(e.body);
        } else {
          console.warn(e);
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.warn(`TRYING AGAIN.`);
      }
    }
  }

  // Something failed if we got to the end here.
  throw error;
};
