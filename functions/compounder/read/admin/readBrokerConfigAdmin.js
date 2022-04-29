(async () => {
  const readCompounderConfig = require("../readCompounderConfig");
  try {
    const config = await readCompounderConfig();
    console.log(config);
  } catch (e) {
    console.error(e);
  }
})();
