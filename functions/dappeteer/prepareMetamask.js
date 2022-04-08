module.exports = async (browser) => {
  const dappeteer = require("@chainsafe/dappeteer");

  const readMetamaskPhrase = require('../secrets/specific/readMetamaskPhrase');

  const phrase = await readMetamaskPhrase();
  const metamask = await dappeteer.setupMetamask(browser, {
    seed: phrase
  });

  return metamask;
}
