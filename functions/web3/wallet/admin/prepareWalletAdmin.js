(async () => {
  const prepareWallet = require("../prepareWallet");
  try {
    const wallet = await prepareWallet();
    console.log(wallet);
  } catch (e) {
    console.error(e);
  }
})();
