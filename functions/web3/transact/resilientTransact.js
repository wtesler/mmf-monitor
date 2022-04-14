/**
 * Try the transaction a few times with a pause in-between.
 *
 * @param transactionAction An function which returns a pending transaction.
 */
module.exports = async (transactionAction) => {
  const TOTAL_ATTEMPTS = 3;

  let numAttempts = 0;
  let error;

  while (numAttempts < TOTAL_ATTEMPTS) {
    try {
      const tx = await transactionAction;

      const awaitedTx = await tx.wait();

      console.log(awaitedTx);

      if (awaitedTx.code === 'CALL_EXCEPTION') {
        // noinspection ExceptionCaughtLocallyJS
        throw awaitedTx; // It is intended that this is caught locally.
      }

      return awaitedTx;
    } catch (e) {
      error = e;
      numAttempts++;
      if (numAttempts < TOTAL_ATTEMPTS) {
        console.warn(`TRANSACTION FAILED. TRYING AGAIN AFTER PAUSE.`);
        console.warn(e);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  throw error;
}
