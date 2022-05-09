(async () => {
  const {BigNumber, FixedNumber} = require("ethers");
  const computeSrcAndDstValues = require("../computeSrcAndDstValues");
  const response = computeSrcAndDstValues(
    'MUSD', 'USDC', 1, BigNumber.from('5000000'), 1000, .997, 1, .996, false);
  console.log(response);
})();
