module.exports = async () => {
  const MMFClient = require('../MMF/MMFClient');

  const indexHtml = await MMFClient.readAppIndex();

  const cueIndex = indexHtml.indexOf('_next/static/chunks/pages/_app');

  let url = '';
  for (let i = cueIndex; i < indexHtml.length; i++) {
    if (indexHtml[i] === '"') {
      break;
    }
    url += indexHtml[i];
  }

  url = 'https://vaults.mm.finance/' + url;

  return url;
};
