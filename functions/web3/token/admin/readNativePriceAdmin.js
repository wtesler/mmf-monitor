(async () => {
  const readNativePrice = require("../readNativePrice");
  const prepareProvider = require("../../wallet/prepareProvider");
  const TokenNames = require("../../../constants/TokenNames");

  const provider = prepareProvider();

  const response = await readNativePrice(TokenNames.MMF_MUSD, provider);

  console.log(response);
  console.log(response.toString());
  console.log(response.toUnsafeFloat());
})();
