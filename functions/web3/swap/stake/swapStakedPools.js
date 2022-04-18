/**
 * Swap from one staked LP pool to another.
 *
 * @param srcPool token pair name.
 * @param dstPool token pair name.
 * @param mnemonic The mnemonic of the wallet.
 */
module.exports = async (srcPool, dstPool, mnemonic) => {
  const prepareWallet = require('../../wallet/prepareWallet');
  const addMaxLiquidity = require('../../liquidity/addMaxLiquidity');
  const stakeMaxLiquidity = require('../../liquidity/stakeMaxLiquidity');
  const unstakeMaxLiquidity = require('../../liquidity/unstakeMaxLiquidity');
  const removeMaxLiquidity = require('../../liquidity/removeMaxLiquidity');
  const createEqualLiquidity = require('../liquidity/createEqualLiquidity');
  const swapPairs = require('../liquidity/swapPairs');
  const TokenAddresses = require("../../../constants/TokenAddresses");

  const ACTION = `SWAP POOLS`;

  const wallet = await prepareWallet(mnemonic);

  const srcAddress = TokenAddresses[srcPool];
  const dstAddress = TokenAddresses[dstPool];

  console.log(`${ACTION} | ${srcPool} -> ${dstPool}`);

  const srcTokens = srcPool.split('_');
  const dstTokens = dstPool.split('_');

  const srcA = srcTokens[0];
  const srcB = srcTokens[1];

  const dstA = dstTokens[0];
  const dstB = dstTokens[1];

  // Unstake
  const didStakeExist = await unstakeMaxLiquidity(srcPool, wallet);

  if (didStakeExist) {
    // Breakup LP tokens
    await removeMaxLiquidity(srcPool, wallet);

    // Even out broken-up tokens.
    await createEqualLiquidity(srcAddress, wallet);

    // Swap src tokens with dst tokens.
    await swapPairs(srcA, srcB, dstA, dstB, wallet);

    // Create LP tokens.
    await addMaxLiquidity(dstA, dstB, dstAddress, wallet);

    // Stake new LP tokens.
    await stakeMaxLiquidity(dstPool, wallet);
  }

  console.log(`${ACTION} | SUCCESS`);
};
