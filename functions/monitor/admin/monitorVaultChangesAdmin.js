(async () => {
  const monitorVaultChanges = require("../monitorVaultChanges");
  try {
    await monitorVaultChanges();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
