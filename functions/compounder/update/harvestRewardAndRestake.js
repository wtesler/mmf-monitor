module.exports = async (walletData) => {
  const harvestFarmRewards = require("../../web3/liquidity/harvestFarmRewards");
  const swapBasic = require("../../web3/swap/liquidity/swapBasic");
  const createMaxLiquidity = require("../../web3/liquidity/createMaxLiquidity");
  const stakeMaxLiquidity = require("../../web3/liquidity/stakeMaxLiquidity");
  const prepareWallet = require('../../web3/wallet/prepareWallet');
  const readTokenBalance = require('../../web3/token/readTokenBalance');
  const readStakedBalance = require('../../web3/token/readStakedBalance');
  const TokenNames = require('../../constants/TokenNames');
  const sendInBlueClient = await require('../../sendinblue/client/SendInBlueClient');

  const ACTION = `HARVESTING AND RESTAKING`;

  console.log(`${ACTION} | STARTING`);

  const {mnemonic, email, pairToken, rewardToken} = walletData;

  const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

  const wallet = await prepareWallet(mnemonic);

  const stakedBalanceBigNumber = await readStakedBalance(pairToken, wallet);

  if (stakedBalanceBigNumber.isZero()) {
    console.log(`No current stake of ${pairToken} so nothing to harvest.`);
    return;
  }

  // Compound started email.
  await sendInBlueClient.sendEmail(email, 6, {
    pairName: pairToken
  });

  await harvestFarmRewards(pairToken, wallet);

  // It can be good to give the rewards time to settle.
  await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep

  const rewardBigNumber = await readTokenBalance(rewardToken, wallet);

  console.log(`WE HAVE ${rewardBigNumber.toString()} ${rewardToken} REWARD`);

  const halfRewardBigNumberA = rewardBigNumber.div(2);
  const halfRewardBigNumberB = rewardBigNumber.div(2).add(rewardBigNumber.mod(2));

  if (tokenA !== rewardToken) {
    await swapBasic(rewardToken, tokenA, halfRewardBigNumberA, wallet);
  }

  if (tokenB !== rewardToken) {
    await swapBasic(rewardToken, tokenB, halfRewardBigNumberB, wallet);
  }

  await createMaxLiquidity(pairToken, wallet);

  await stakeMaxLiquidity(pairToken, wallet);

  // Compound finished email.
  await sendInBlueClient.sendEmail(email, 7, {
    pairName: pairToken
  });

  console.log(`${ACTION} | SUCCESS`);
};
