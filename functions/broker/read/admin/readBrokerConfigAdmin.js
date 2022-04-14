(async () => {
  const readBrokerConfig = require("../readBrokerConfig");
  try {
    const config = await readBrokerConfig();
    console.log(config);
  } catch (e) {
    console.error(e);
  }
})();
