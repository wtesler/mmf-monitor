(async () => {
  const readWallets = require("../readWallets");
  const wallets = await readWallets();
  console.log(wallets);
})();
