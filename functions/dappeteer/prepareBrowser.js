module.exports = async () => {
  const puppeteer = require('puppeteer');
  const dappeteer = require('@chainsafe/dappeteer');
  const readMetamaskPhrase = require('../secrets/specific/readMetamaskPhrase');

  const phrase = await readMetamaskPhrase();

  const browser = await dappeteer.launch(puppeteer, {metamaskVersion: 'v10.8.1'});
  const metamask = await dappeteer.setupMetamask(browser, {
    seed: phrase
  });

  // await metamask.importPK('53da3148b367516be76783fd0cb66ce511e5201f59b3328c76eb734d6c989890')

  await metamask.addNetwork({
      networkName: 'Cronos',
      rpc: 'https://evm-cronos.crypto.org',
      chainId: 25,
      symbol: 'cro',
      explorer: 'https://cronos.crypto.org/'
    }
  );

  await metamask.switchNetwork('Cronos');

  const page = await browser.newPage();
  await page.goto('https://mm.finance');

  // await metamask.page.bringToFront();
  //
  // const accountOptionsButton = await metamask.page.$('[title="Account Options"]');
  //
  // await accountOptionsButton.click();
  //
  // const connectedSitesButton = await metamask.page.$('[data-testid="account-options-menu__connected-sites"]');
  //
  // await connectedSitesButton.click();

  const [connectWalletButton] = await page.$x("//button[contains(., 'Connect Wallet')]");
  if (connectWalletButton) {
    await connectWalletButton.click();
    const [metamaskButton] = await page.$x("//button[contains(., 'Metamask')]");
    // const metamaskButton = await page.waitForSelector('.space-y-2 > div:nth-child(2)');
    if (metamaskButton) {
      await metamaskButton.click();
    } else {
      throw new Error(`No 'Metamask' button found.`);
    }
  } else {
    throw new Error(`No 'Connect Wallet' button found.`);
  }

  await metamask.approve();

  await page.bringToFront();

  // await metamask.switchAccount(0);
};
