module.exports = async () => {
  const puppeteer = require('puppeteer');
  const dappeteer = require('@chainsafe/dappeteer');

  const options = {
    metamaskVersion: 'v10.8.1',
    headless: false,
    devtools: false,
    dumpio: false,
    args: [
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-account-consistency',
      '--disable-bundled-ppapi-flash',
      '--disable-default-apps',
      '--disable-demo-mode',
      '--disable-flash-3d',
      '--disable-flash-stage3d',
      '--hide-scrollbars',
      '--mute-audio',
      '--disable-infobars',
      '--disable-breakpad',
      "--proxy-server='direct://'",
      '--proxy-bypass-list=*',
    ],
  };

  const browser = await dappeteer.launch(puppeteer, options);

  return browser;
}
