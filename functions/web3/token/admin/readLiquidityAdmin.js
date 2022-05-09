(async () => {
  const readLiquidity = require("../readLiquidity");
  const prepareProvider = require("../../wallet/prepareProvider");
  const TokenNames = require("../../../constants/TokenNames");

  const provider = prepareProvider();

  const response = await readLiquidity(TokenNames.DUSD_USDC, provider);

  for (const key of Object.keys(response)) {
    console.log(`${key}: ${response[key].toString()}`);
  }
})();
