module.exports = async () => {
  const prepareBrowser = require('./prepareBrowser');
  const prepareMetamask = require('./prepareMetamask');
  const prepareCronosNetwork = require('./prepareCronosNetwork');

  const browser = await prepareBrowser();

  console.log("Prepared browser");

  const metamask = await prepareMetamask(browser);

  console.log("Prepared Metamask");

  await prepareCronosNetwork(metamask);

  console.log("Prepared Cronos Network");

  return [browser, metamask];
}
