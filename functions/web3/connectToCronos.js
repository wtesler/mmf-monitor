module.exports = async () => {
  const {ethers} = require("ethers");

  const provider = new ethers.providers.JsonRpcProvider('https://evm.cronos.org', {
    name: 'CRO',
    chainId: 25
  });

  const readDefiMnemonic = require('../secrets/specific/readDefiMnemonic');
  const mnemonic = await readDefiMnemonic();

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  // const balance = await getCroBalance(provider, wallet.address);
  // console.log(balance);

  const swapCroForUsd = require('./swap/swapCroForUsd');

  await swapCroForUsd(wallet);

  // console.log(wallet);

  // console.log(contract);

  // const balance = await contract.balanceOf(wallet.address);
  // console.log(balance);

  // const name = await contract.name();
  // const symbol = await contract.symbol();
  // console.log(name);
  // console.log(symbol);

};

const getCroBalance = async (provider, address) => {
  const {ethers} = require("ethers");
  const balance = await provider.getBalance(address);

  return ethers.BigNumber.from(balance)
    .div(ethers.BigNumber.from("10000000000"))
    .toNumber() / 100000000;
};
