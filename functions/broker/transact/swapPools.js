module.exports = async (srcPool, dstPool) => {
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const readBrokerConfig = require('../read/readBrokerConfig');
  const addMaxLiquidity = require('../../web3/liquidity/addMaxLiquidity');
  const stakeMaxLiquidity = require('../../web3/liquidity/stakeMaxLiquidity');
  const unstakeMaxLiquidity = require('../../web3/liquidity/unstakeMaxLiquidity');

  const wallet = await prepareWallet();

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;

  const isPoolInConfig = (pool) => {
    return bullConfig.name === pool || bearConfig.name === pool;
  }

  if (!isPoolInConfig(srcPool) || !isPoolInConfig(dstPool)) {
    throw new Error('src and dst pools must be a part of the current broker config.');
  }

  const ACTION = `SWAP POOLS`;

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

  // Even out broken-up tokens.

  // Swap src tokens with dst tokens.

  // Create LP tokens
  await addMaxLiquidity(dstA, dstB, wallet);

  // Stake new LP tokens.
  await stakeMaxLiquidity(dstPool, wallet);
};
