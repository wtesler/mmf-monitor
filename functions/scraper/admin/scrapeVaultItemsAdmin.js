(async () => {
  const scrapeVaultItems = require("../scrapeVaultItems");
  try {
    const items = await scrapeVaultItems();
    console.log(items);
  } catch (e) {
    console.error(e);
  }
})();
