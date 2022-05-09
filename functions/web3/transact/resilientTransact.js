/**
 * Try the transaction a few times with a pause in-between.
 *
 * @param transactionAction An function which returns a pending transaction.
 * @param attempts Number of attempts before throwing error.
 * @param timeout How long before we assumed the tx hanged.
 */
module.exports = async (transactionAction, attempts=6, timeout=120000) => {
  let numAttempts = 0;
  let error;

  while (numAttempts < attempts) {
    try {

      const tx = await transactionAction();

      if (tx === null) {
        return false; // Transaction Action was a NOOP.
      }

      const timeoutPromise = new Promise(resolve => setTimeout(resolve, timeout, 'timeout'));

      const awaitedTx = await Promise.race([tx.wait(), timeoutPromise]);

      if (awaitedTx === 'timeout') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('TIMEOUT WAITING FOR TRANSACTION');
      }

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
