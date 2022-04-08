module.exports = async () => {
  const prepareAutomatedDapp = require('../prepareAutomatedDapp');
  const prepareNewPage = require('../prepareNewPage');
  const connectWallet = require('./main/connectWallet');

  const [browser, metamask] = await prepareAutomatedDapp();

  const page = await prepareNewPage(browser);

  await page.goto('https://mm.finance');

  await connectWallet(page, metamask);
};
