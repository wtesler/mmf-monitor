(async () => {
  const prepareBrowser = require("../prepareBrowser");
  try {
    await prepareBrowser();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
