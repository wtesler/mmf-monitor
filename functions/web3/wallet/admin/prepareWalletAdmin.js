(async () => {
  const prepareWallet = require("../prepareWallet");
  const wallet = await prepareWallet();
  console.log(wallet);
})();
