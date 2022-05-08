(async () => {
  const readArbitrageConfig = require("../readArbitrageConfig");
  const config = await readArbitrageConfig();
  console.log(config);
})();
