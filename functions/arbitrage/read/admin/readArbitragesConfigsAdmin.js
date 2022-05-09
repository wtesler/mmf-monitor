(async () => {
  const readArbitrageConfigs = require("../readArbitrageConfigs");
  const configs = await readArbitrageConfigs();
  console.log(configs);
})();
