module.exports = async (mnemonic) => {
  const {ethers} = require("ethers");

  const provider = new ethers.providers.JsonRpcProvider('https://evm.cronos.org', {
    name: 'CRO',
    chainId: 25
  });

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  return wallet;
};
