module.exports = async (page, metamask) => {
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
}
