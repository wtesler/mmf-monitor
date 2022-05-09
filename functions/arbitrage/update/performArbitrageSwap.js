module.exports = async (srcToken, dstToken, srcAmount, dstPriceFixed, slippage, wallet, nonce, onSwapResult) => {
  const swapFast = require('../../web3/swap/liquidity/swapFast');

  try {
    await swapFast(srcToken, dstToken, srcAmount, dstPriceFixed, slippage, nonce, wallet);
    onSwapResult(null, null);
  } catch (e) {
    const errStr = e.toString();
    if (errStr.includes('Bad Gateway')) {
      console.warn('Bad Gateway.');
    } else {
      console.log(e);
      // console.warn(`${e.code}: ${e.reason}`);
    }
    onSwapResult(null, e);
  }
};
