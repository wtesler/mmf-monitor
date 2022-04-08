module.exports = async (metamask) => {
  await metamask.addNetwork({
      networkName: 'Cronos',
      rpc: 'https://evm-cronos.crypto.org',
      chainId: 25,
      symbol: 'cro',
      explorer: 'https://cronos.crypto.org/'
    }
  );

  await metamask.switchNetwork('Cronos');
}
