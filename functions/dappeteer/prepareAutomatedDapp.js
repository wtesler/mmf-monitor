module.exports = async () => {
  const prepareBrowser = require('./prepareBrowser');
  const prepareMetamask = require('./prepareMetamask');
  const prepareCronosNetwork = require('./prepareCronosNetwork');

  const browser = await prepareBrowser();

  const metamask = await prepareMetamask(browser);

  await prepareCronosNetwork(metamask);

  return [browser, metamask];
}
