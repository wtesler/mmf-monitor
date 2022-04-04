module.exports = async () => {
  const readStoredVaultItems = require('../vault/read/readStoredVaultItems');
  const updateStoredVaultItems = require('../vault/update/updateStoredVaultItems');
  const notifyNewItem = require('../notify/notifyNewItem');
  const scrapeVaultItems = require('../scraper/scrapeVaultItems');

  const storedVaultItemsPromise = readStoredVaultItems();
  const currentVaultItemsPromise = scrapeVaultItems();

  const [storedVaultItems, currentVaultItems] = await Promise.all([
    storedVaultItemsPromise,
    currentVaultItemsPromise
  ]);

  const newItems = [];

  for (const curVaultItem of currentVaultItems) {
    const curName = curVaultItem.name;
    let didItemExist = false;
    for (const storedVaultItem of storedVaultItems) {
      const storedName = storedVaultItem.name;
      if (curName === storedName) {
        didItemExist = true;
        break;
      }
    }
    if (!didItemExist) {
      console.log(`New Item: ${curVaultItem.name}`);
      newItems.push(curVaultItem);
    }
  }

  if (newItems.length > 0) {
    for (const item of newItems) {
      await notifyNewItem(item.name);
    }
    await updateStoredVaultItems(currentVaultItems);
  }
};
