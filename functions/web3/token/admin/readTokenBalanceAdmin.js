(async () => {
  const readTokenBalance = require("../readTokenBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  try {
    const wallet = await prepareWallet();

    const balance = await readTokenBalance(TokenNames.USDC, wallet);

    console.log(balance);
  } catch (e) {
    console.error(e);
  }
})();
