(async () => {
  const cronoscanClient = await require('../CronoscanClient');

  const page = await cronoscanClient.readPage('0x97749c9b61f878a880dfe312d2594ae07aed7656');
  const objectStr = cronoscanClient.parsePriceUsdObject(page);
  console.log(objectStr);
})();
