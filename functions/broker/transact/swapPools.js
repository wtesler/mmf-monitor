module.exports = async (srcPool, dstPool) => {
  const readBrokerConfig = require('../read/readBrokerConfig');
  const DexScreenerClient = require('../../dexscreener/client/DexScreenerClient');
  const NetworkNames = require('../../constants/NetworkNames');
  const addLiquidity = require('../../web3/liquidity/addLiquidity');

  const config = await readBrokerConfig();
  const bullConfig = config.bull;
  const bearConfig = config.bear;

  const isPoolInConfig = (pool) => {
    return bullConfig.name === pool || bearConfig.name === pool;
  }

  if (!isPoolInConfig(srcPool) || !isPoolInConfig(dstPool)) {
    throw new Error('src and dst pools must be a part of the current broker config.');
  }

  const srcTokens = srcPool.split('_');
  const dstTokens = dstPool.split('_');

  // Harvest Rewards and Unstake

  // Breakup LP tokens



  // Exchange broken-up tokens with new tokens

  // Create LP tokens

  await addLiquidity(dstTokens[0], dstTokens[1], CONTINUED);

  // Stake new LP tokens.
};
