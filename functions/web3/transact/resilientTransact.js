/**
 * Try the transaction a few times with a pause in-between.
 *
 * @param transactionAction An function which returns a pending transaction.
 * @param attempts Number of attempts before throwing error.
 */
module.exports = async (transactionAction, attempts=6) => {
  let numAttempts = 0;
  let error;

  while (numAttempts < attempts) {
    try {
      // const timeoutPromise = new Promise(resolve => setTimeout(resolve, 120000, 'timeout')); // 2 minutes.

      // const tx = await Promise.race([transactionAction(), timeoutPromise]);
      const tx = await transactionAction();

      // if (tx === 'timeout') {
      //   // noinspection ExceptionCaughtLocallyJS
      //   throw new Error('TIMEOUT WAITING FOR TRANSACTION');
      // }

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
      if (numAttempts < attempts) {
        console.log(`TRANSACTION FAILED. TRYING AGAIN AFTER PAUSE.`);
        if (e.code === 'CALL_EXCEPTION') {
          console.log(e.reason);
        } if (e.code === 'SERVER_ERROR') {
          console.log(e.reason);
          console.log(e.body);
        } else {
          console.log(e);
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log(`TRYING AGAIN.`);
      }
    }
  }

  // Something failed if we got to the end here.
  throw error;
};
