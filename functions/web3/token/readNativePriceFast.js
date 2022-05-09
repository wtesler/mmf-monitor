module.exports = async (pairTokenName, provider) => {
  const readNativePrice = require('./readNativePrice');
  return readNativePrice(pairTokenName, provider, false);
};
