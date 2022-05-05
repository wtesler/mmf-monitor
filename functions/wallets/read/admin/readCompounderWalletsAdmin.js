(async () => {
  const readCompounderWallets = require("../readCompounderWallets");
  const wallets = await readCompounderWallets();
  console.log(wallets);
})();
