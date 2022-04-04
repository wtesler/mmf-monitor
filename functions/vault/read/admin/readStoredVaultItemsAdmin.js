(async () => {
  const readStoredVaultItems = require("../readStoredVaultItems");
  try {
    const vaultItems = await readStoredVaultItems();
    console.log(vaultItems);
  } catch (e) {
    console.error(e);
  }
})();
