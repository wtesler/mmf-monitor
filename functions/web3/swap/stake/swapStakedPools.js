/**
 * Swap from one staked LP pool to another.
 *
 * @param bullPairToken token pair name.
 * @param bearToken token name of the stable token to use when selling.
 * @param mnemonic The mnemonic of the wallet.
 * @param email The of the wallet.
 * @param signal 'BUY' or 'SELL' signal.
 */
module.exports = async (bullPairToken, bearToken, mnemonic, email, signal) => {
  const sendInBlueClient = await require('../../../sendinblue/client/SendInBlueClient');
  const prepareWallet = require('../../wallet/prepareWallet');
  const unstakeMaxLiquidity = require('../../liquidity/unstakeMaxLiquidity');
  const removeMaxLiquidity = require('../../liquidity/removeMaxLiquidity');
  const swapBasic = require('../liquidity/swapBasic');
  const readTokenBalance = require('../../token/readTokenBalance');
  const createMaxLiquidity = require('../../liquidity/createMaxLiquidity');
  const stakeMaxLiquidity = require('../../liquidity/stakeMaxLiquidity');
  const TokenNames = require("../../../constants/TokenNames");

  const ACTION = `SWAP POOLS`;

  const wallet = await prepareWallet(mnemonic);

  const isSellSignal = signal === 'SELL';

  console.log(`${ACTION} | BULL PAIR: ${bullPairToken}, BEAR: ${bearToken}`);

  const [bullTokenA, bullTokenB] = TokenNames.SplitTokenNames(bullPairToken);

  let swapASummary;
  let swapBSummary;

  if (isSellSignal) {
    await unstakeMaxLiquidity(bullPairToken, wallet);
    await removeMaxLiquidity(bullPairToken, wallet);

    // It can be good to give the rewards time to settle.
    await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep

    const bullTokenPromiseA = readTokenBalance(bullTokenA, wallet);
    const bullTokenPromiseB = readTokenBalance(bullTokenB, wallet);
    const [bullTokenABalanceBigNumber, bullTokenBBalanceBigNumber] = await Promise.all([
      bullTokenPromiseA,
      bullTokenPromiseB
    ]);

    if (bullTokenA !== bearToken) {
      swapASummary = await swapBasic(bullTokenA, bearToken, bullTokenABalanceBigNumber, wallet);
    }

    if (bullTokenB !== bearToken) {
      swapBSummary = await swapBasic(bullTokenB, bearToken, bullTokenBBalanceBigNumber, wallet);
    }
  } else {
    const bearTokenBalanceBigNumber = await readTokenBalance(bearToken, wallet);
    const halfBearTokenBalanceA = bearTokenBalanceBigNumber.div(2);
    const halfBearTokenBalanceB = bearTokenBalanceBigNumber.div(2).add(bearTokenBalanceBigNumber.mod(2));

    const isBearTokenBalanceZero = bearTokenBalanceBigNumber.isZero();

    if (bullTokenA !== bearToken && !isBearTokenBalanceZero) {
      swapASummary = await swapBasic(bearToken, bullTokenA, halfBearTokenBalanceA, wallet);
    }

    if (bullTokenB !== bearToken && !isBearTokenBalanceZero) {
      swapBSummary = await swapBasic(bearToken, bullTokenB, halfBearTokenBalanceB, wallet);
    }

    await createMaxLiquidity(bullPairToken, wallet);

    await stakeMaxLiquidity(bullPairToken, wallet);
  }

  const createSwapMessage = swapSummary => {
    return `Swapped ${swapSummary.src.amount} ${swapSummary.src.name} for at least ${swapSummary.dst.amount} ${swapSummary.dst.name}`;
  };

  const swapAMessage = swapASummary ? createSwapMessage(swapASummary) : '';
  const swapBMessage = swapBSummary ? createSwapMessage(swapBSummary) : '';

  // Send Swap Confirmation Email.
  await sendInBlueClient.sendEmail(email, 5, {
    swapAMessage: swapAMessage,
    swapBMessage: swapBMessage,
  });

  console.log(`${ACTION} | SUCCESS`);
};
