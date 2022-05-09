(async () => {
  const createArbitrageConfig = require("../createArbitrageConfig");
  await createArbitrageConfig(
    {
      baseSlippage: 0.997,
      sellThreshold: 1.0029,
      maxSrcNumber: 1000,
      email: 'willtesler@gmail.com',
      pairToken: 'USDT_USDC',
      buyThreshold: 0.9976,
      crossoverMult: 600,
    }
  );
})();
