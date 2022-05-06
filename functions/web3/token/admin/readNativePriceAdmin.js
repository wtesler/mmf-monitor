(async () => {
  const readNativePrice = require("../readNativePrice");
  const prepareProvider = require("../../wallet/prepareProvider");
  const TokenNames = require("../../../constants/TokenNames");

  const provider = prepareProvider();

  const response = await readNativePrice(TokenNames.MUSD_USDC, provider);

  console.log(response);
  console.log(response.toUnsafeFloat());
  // console.log(1 / response.toUnsafeFloat());
})();
