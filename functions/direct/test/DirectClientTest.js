(async () => {
  const directClient = await require('../DirectClient');
  directClient.setToTest();
  await directClient.swapStakedPools('ABC', 'DEF');
})();
