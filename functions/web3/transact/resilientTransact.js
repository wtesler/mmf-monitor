/**
 * Try the transaction a few times with a pause in-between.
 *
 * @param transactionAction An function which returns a pending transaction.
 */
module.exports = async (transactionAction) => {
  const TOTAL_ATTEMPTS = 5;

  let numAttempts = 0;
  let error;

  while (numAttempts < TOTAL_ATTEMPTS) {
    try {
      const tx = await transactionAction();

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
        } else {
          console.warn(e);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.warn(`TRYING AGAIN.`);
      }
    }
  }

  throw error;
};
