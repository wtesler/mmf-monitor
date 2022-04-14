(async () => {
  const readStakedBalance = require("../readStakedBalance");
  const prepareWallet = require("../../wallet/prepareWallet");
  const TokenNames = require("../../../constants/TokenNames");

  try {
    const wallet = await prepareWallet();

    const balance = await readStakedBalance(TokenNames.USDC_USDT, wallet);

    console.log(balance);
  } catch (e) {
    console.error(e);
  }
})();
