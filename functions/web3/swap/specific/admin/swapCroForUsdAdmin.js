(async () => {
  const swapCroForUsd = require("../swapCroForUsd");
  const prepareWallet = require("../../../wallet/prepareWallet");
  const wallet = await prepareWallet();
  await swapCroForUsd(20, 8, wallet);
})();
