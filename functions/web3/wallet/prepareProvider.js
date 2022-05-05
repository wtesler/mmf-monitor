module.exports = () => {
  const {ethers} = require("ethers");

  const provider = new ethers.providers.JsonRpcProvider('https://evm.cronos.org', {
    name: 'CRO',
    chainId: 25
  });

  return provider;
};
