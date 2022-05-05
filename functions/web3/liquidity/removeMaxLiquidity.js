module.exports = async (tokenPairName, wallet) => {
  const {ethers} = require("ethers");
  const resilientTransact = require("../../web3/transact/resilientTransact");
  const readTokenBalance = require("../token/readTokenBalance");
  const readLiquidityBalance = require("../token/readLiquidityBalance");
  const signMeerkatLpMessage = require('./helper/signMeerkatLpMessage');
  const TokenAddresses = require("../../constants/TokenAddresses");
  const FixedNumberUtils = require("../../numbers/FixedNumberUtils");
  const ContractAddresses = require("../../constants/ContractAddresses");
  const routerAbi = require("../contracts/abis/meerkat_router_abi.json");
  const meerkatPairAbi = require('../contracts/abis/meerkat_pair_abi.json');

  const ACTION = `REMOVING MAX LIQUIDITY`;

  console.log(`${ACTION} | ${tokenPairName}`);

  await resilientTransact(async () => {
    const tokenPairBalanceBigNumber = await readTokenBalance(tokenPairName, wallet);
    const liquidityBalance = await readLiquidityBalance(tokenPairName, wallet);

    console.log(`${ACTION} | WE HAVE ${tokenPairBalanceBigNumber.toString()} ${tokenPairName}`);

    const tokens = tokenPairName.split('_');
    const tokenAName = tokens[0];
    const tokenBName = tokens[1];

    const addressTokenA = TokenAddresses[tokenAName];
    const addressTokenB = TokenAddresses[tokenBName];

    const routerContractAddress = ContractAddresses.ROUTER_MEERKAT;

    const contract = new ethers.Contract(routerContractAddress, routerAbi, wallet);

    const lpAddress = TokenAddresses[tokenPairName];

    const meerkatPairContract = new ethers.Contract(lpAddress, meerkatPairAbi, wallet);
    const nonce = await meerkatPairContract.nonces(wallet.address);

    const deadline = Date.now() + 1000 * 60 * 2; // 2 minutes

    const [v, r, s] = await signMeerkatLpMessage(
      wallet,
      lpAddress,
      contract,
      routerContractAddress,
      tokenPairBalanceBigNumber,
      deadline,
      nonce.toHexString()
    );

    const liquidityBalanceABigNumber = liquidityBalance[tokenAName];
    const liquidityBalanceBBigNumber = liquidityBalance[tokenBName];

    if (liquidityBalanceABigNumber.isZero() || liquidityBalanceBBigNumber.isZero()) {
      throw new Error('Possibly did not pull balances properly. Trying again.');
    }

    const slippage = .995;
    const tokenAMinAmountFixedNumber = FixedNumberUtils.Multiply(liquidityBalanceABigNumber, slippage);
    const tokenBMinAmountFixedNumber = FixedNumberUtils.Multiply(liquidityBalanceBBigNumber, slippage);

    const tokenAMinAmountBigNumber = FixedNumberUtils.NumberToBigNumber(tokenAMinAmountFixedNumber);
    const tokenBMinAmountBigNumber = FixedNumberUtils.NumberToBigNumber(tokenBMinAmountFixedNumber);

    console.log(`${ACTION} | WE WILL GET AT LEAST ${tokenAMinAmountBigNumber.toString()} ${tokenAName} and ${tokenBMinAmountBigNumber.toString()} ${tokenBName}`);

    const args = [
      addressTokenA,
      addressTokenB,
      tokenPairBalanceBigNumber,
      tokenAMinAmountBigNumber,
      tokenBMinAmountBigNumber,
      wallet.address,
      deadline,
      false,
      v,
      r,
      s
    ];

    return contract.removeLiquidityWithPermit(...args, {gasPrice: 7000000000000});
  });

  console.log(`${ACTION} | SUCCESS`);
};
