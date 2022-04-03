(async () => {
  const notifyNewItem = require("../notifyNewItem");
  try {
    await notifyNewItem('TEST-PAIR 5');
  } catch (e) {
    console.error(e);
  }
})();
