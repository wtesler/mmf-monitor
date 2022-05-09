(async () => {
  const createArbitrageConfig = require("../createArbitrageConfig");
  await createArbitrageConfig(
    {
      updatePeriodMs: 1000,
      baseSlippage: 0.98,
      sellThreshold: 1.003,
      maxSrcNumber: 1000,
      email: 'willtesler@gmail.com',
      pairToken: 'DUSD_USDC',
      buyThreshold: 0.9957,
      crossoverMult: 1000,
    }
  );
})();
