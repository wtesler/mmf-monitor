module.exports = async (wallet) => {
  return await wallet.provider.getTransactionCount(wallet.address, "latest");
}
