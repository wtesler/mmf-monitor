/**
 * Swap from one staked LP pool to another.
 *
 * @param srcConfig token `name` and token `address`.
 * @param dstConfig token `name` and token `address`.
 */
module.exports = async (srcConfig, dstConfig) => {
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const addMaxLiquidity = require('../../web3/liquidity/addMaxLiquidity');
  const stakeMaxLiquidity = require('../../web3/liquidity/stakeMaxLiquidity');
  const unstakeMaxLiquidity = require('../../web3/liquidity/unstakeMaxLiquidity');
  const removeMaxLiquidity = require('../../web3/liquidity/removeMaxLiquidity');
  const createEqualLiquidity = require('../../web3/swap/liquidity/createEqualLiquidity');
  const swapPairs = require('../../web3/swap/liquidity/swapPairs');

  const ACTION = `SWAP POOLS`;

  const wallet = await prepareWallet();

  const srcPool = srcConfig.name;
  const srcAddress = srcConfig.address;

  const dstPool = dstConfig.name;
  const dstAddress = dstConfig.address;

  console.log(`${ACTION} | ${srcPool} -> ${dstPool}`);

  const srcTokens = srcPool.split('_');
  const dstTokens = dstPool.split('_');

  const srcA = srcTokens[0];
  const srcB = srcTokens[1];

  const dstA = dstTokens[0];
  const dstB = dstTokens[1];

  // Unstake
  await unstakeMaxLiquidity(srcPool, wallet);

  // Breakup LP tokens
  await removeMaxLiquidity(srcPool, wallet);

  // Even out broken-up tokens.
  await createEqualLiquidity(srcAddress, wallet);

  // Swap src tokens with dst tokens.
  await swapPairs(srcA, srcB, dstA, dstB, wallet);

  // Create LP tokens.
  await addMaxLiquidity(dstA, dstB, wallet);

  // Stake new LP tokens.
  await stakeMaxLiquidity(dstPool, wallet);
};
