// https://moonflow.solutions/rpc-servers for list of RPC servers

module.exports = (name = 'CRO', chainId = 25, rpcUrl = 'https://mmf-rpc.xstaking.sg') => {
  const {ethers} = require("ethers");

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
    name: name,
    chainId: chainId
  });

  return provider;
};
