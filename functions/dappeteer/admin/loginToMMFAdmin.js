(async () => {
  const prepareBrowser = require("../loginToMMF");
  try {
    await prepareBrowser();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
