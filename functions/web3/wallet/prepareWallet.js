const {ethers} = require("ethers");
module.exports = async () => {
  const {ethers} = require("ethers");

  const provider = new ethers.providers.JsonRpcProvider('https://evm.cronos.org', {
    name: 'CRO',
    chainId: 25
  });

  const readDefiMnemonic = require('../../secrets/specific/readDefiMnemonic');
  const mnemonic = await readDefiMnemonic();

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  return wallet;
};
