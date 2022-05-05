module.exports = async (mnemonic) => {
  const {ethers} = require("ethers");
  const prepareProvider = require("./prepareProvider");

  const provider = prepareProvider();

  const wallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

  return wallet;
};
