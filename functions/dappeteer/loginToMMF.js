module.exports = async () => {
  const puppeteer = require('puppeteer');
  const dappeteer = require('@chainsafe/dappeteer');

  const prepareMetamask = require('./prepareMetamask');
  const setupCronosNetwork = require('./setupCronosNetwork');
  const connectWallet = require('./connectWallet');

  const browser = await dappeteer.launch(puppeteer, {metamaskVersion: 'v10.8.1'});

  const metamask = await prepareMetamask(browser);

  await setupCronosNetwork(metamask);

  const page = await browser.newPage();
  await page.goto('https://mm.finance');

  await connectWallet(page, metamask);
};
