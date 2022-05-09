module.exports = async (srcToken, dstToken, srcAmount, dstPriceFixed, slippage, wallet, nonce, onSwapResult) => {
  const swapFast = require('../../web3/swap/liquidity/swapFast');

  try {
    const completedTx = await swapFast(srcToken, dstToken, srcAmount, dstPriceFixed, slippage, nonce, wallet);
    onSwapResult(completedTx, null);
  } catch (e) {
    const errStr = e.toString();
    if (errStr.includes('Bad Gateway')) {
      console.warn('Bad Gateway.');
    } else {
      if (e.code) {
        console.warn(`${e.code}: ${e.reason}`);
      } else {
        console.log(e);
      }
    }
    onSwapResult(null, e);
  }
};
