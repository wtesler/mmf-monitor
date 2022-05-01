/**
 * Swap from one staked LP pool to another.
 *
 * @param srcPool token pair name.
 * @param dstPool token pair name.
 * @param mnemonic The mnemonic of the wallet.
 * @param email The of the wallet.
 * @param signal 'BUY' or 'SELL' signal.
 */
module.exports = async (srcPool, dstPool, mnemonic, email, signal) => {
  const sendInBlueClient = await require('../../../sendinblue/client/SendInBlueClient');
  const prepareWallet = require('../../wallet/prepareWallet');
  const unstakeMaxLiquidity = require('../../liquidity/unstakeMaxLiquidity');
  const removeMaxLiquidity = require('../../liquidity/removeMaxLiquidity');
  const swapPairs = require('../liquidity/swapPairs');
  const createEvenLiquidity = require('../liquidity/createEvenLiquidity');
  const addMaxLiquidity = require('../../liquidity/createMaxLiquidity');
  const stakeMaxLiquidity = require('../../liquidity/stakeMaxLiquidity');
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const ACTION = `SWAP POOLS`;

  const wallet = await prepareWallet(mnemonic);

  // const srcAddress = TokenAddresses[srcPool];
  const dstAddress = TokenAddresses[dstPool];

  console.log(`${ACTION} | ${srcPool} -> ${dstPool}`);

  const srcTokens = srcPool.split('_');
  const dstTokens = dstPool.split('_');

  const srcA = srcTokens[0];
  const srcB = srcTokens[1];

  const dstA = dstTokens[0];
  const dstB = dstTokens[1];

  const isSellSignal = signal === 'SELL';

  // Unstake
  let didStakeExist = true;
  if (isSellSignal) {
    didStakeExist = await unstakeMaxLiquidity(srcPool, wallet);
  }

  if (didStakeExist) {
    // Breakup LP tokens
    if (isSellSignal) {
      await removeMaxLiquidity(srcPool, wallet);
    }

    // Swap src tokens with dst tokens.
    const [swapASummary, swapBSummary] = await swapPairs(srcA, srcB, dstA, dstB, wallet);

    if (!isSellSignal) { // Buy Signal
      // Even out tokens.
      await createEvenLiquidity(dstAddress, wallet);

      // Create LP tokens.
      await addMaxLiquidity(dstA, dstB, dstAddress, wallet);

      // Stake new LP tokens.
      await stakeMaxLiquidity(dstPool, wallet);
    }

    // Send Confirmation Email

    const createNoSwapMessage = token => {
      return `Did not need to swap ${token}`;
    };

    const createSwapMessage = swapSummary => {
      return `Swapped ${swapSummary.src.amount} ${swapSummary.src.name} for at least ${swapSummary.dst.amount} ${swapSummary.dst.name}`;
    };

    const swapAMessage = swapASummary ? createSwapMessage(swapASummary) : createNoSwapMessage(srcA);
    const swapBMessage = swapBSummary ? createSwapMessage(swapBSummary) : createNoSwapMessage(srcB);

    // Send Swap Confirmation Email.
    await sendInBlueClient.sendEmail(email, 5, {
      srcPool: srcPool,
      dstPool: dstPool,
      swapAMessage: swapAMessage,
      swapBMessage: swapBMessage,
    });
  }

  console.log(`${ACTION} | SUCCESS`);
};
