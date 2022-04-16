module.exports = async (amountIn, amountOut, wallet) => {
  const FormatToken = require("../../../constants/FormatToken");
  const swapCro = require("../swapCro");

  const formattedIn = FormatToken.formatToken('CRO', amountIn);
  const formattedOut = FormatToken.formatToken('USDC', amountOut);

  const internalTransactions = [
    '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
    '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59'
  ];

  await swapCro(formattedIn, formattedOut, internalTransactions, wallet);
};
