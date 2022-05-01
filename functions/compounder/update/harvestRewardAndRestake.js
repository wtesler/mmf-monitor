module.exports = async (walletData) => {
  const harvestFarmRewards = require("../../web3/liquidity/harvestFarmRewards");
  const readCompounderConfig = require('../read/readCompounderConfig');
  const swapBasic = require("../../web3/swap/liquidity/swapBasic");
  const createMaxLiquidity = require("../../web3/liquidity/createMaxLiquidity");
  const stakeMaxLiquidity = require("../../web3/liquidity/stakeMaxLiquidity");
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const TokenAddresses = require('../../constants/TokenAddresses');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');

  const ACTION = `HARVESTING AND RESTAKING`;

  console.log(`${ACTION} | STARTING`);

  const config = await readCompounderConfig();
  const pairName = config.pair;
  const rewardToken = config.reward;

  const pairAddress = TokenAddresses[pairName];
  const [tokenA, tokenB] = pairName.split('_');

  const {mnemonic, email} = walletData;

  const wallet = await prepareWallet(mnemonic);

  // Compound started email.
  await sendInBlueClient.sendEmail(email, 6, {
    pairName: pairName
  });

  await harvestFarmRewards(pairName, wallet);

  const rewardBigNumber = await readTokenBalance(rewardToken, wallet, true);

  console.log(`WE HAVE ${rewardBigNumber.toString()} ${rewardToken} REWARD`);

  const halfRewardBigNumberA = rewardBigNumber.div(2);
  const halfRewardBigNumberB = rewardBigNumber.div(2).add(rewardBigNumber.mod(2));

  if (tokenA !== rewardToken) {
    await swapBasic(rewardToken, tokenA, halfRewardBigNumberA, wallet);
  }

  if (tokenB !== rewardToken) {
    await swapBasic(rewardToken, tokenB, halfRewardBigNumberB, wallet);
  }

  await createMaxLiquidity(tokenA, tokenB, pairAddress, wallet);

  await stakeMaxLiquidity(pairName, wallet);

  // Compound finished email.
  await sendInBlueClient.sendEmail(email, 7, {
    pairName: pairName
  });

  console.log(`${ACTION} | SUCCESS`);
};
