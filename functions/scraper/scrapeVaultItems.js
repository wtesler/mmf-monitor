module.exports = async () => {
  const MMFClient = require('../mmf/MMFClient');
  const scrapeMainPageUrl = require('./scrapeMainPageUrl');

  const appUrl = await scrapeMainPageUrl();
  const page = await MMFClient.readAppPage(appUrl);

  // Use this to locate where the items are in the text.
  const cueIndex = page.indexOf('pricePath');

  // Find the bounding array of the items.

  let startIndex = -1;
  let endIndex = -1;

  // Start index
  for (let i = cueIndex; i > 0; i--) {
    if (page[i] === '[') {
      startIndex = i + 1;
      break;
    }
  }

  // End index
  let bracketDepth = 0;
  for (let i = cueIndex; i < page.length; i++) {
    if (page[i] === '[') {
      bracketDepth++;
    } else if (page[i] === ']') {
      if (bracketDepth === 0) {
        endIndex = i;
        break;
      } else {
        bracketDepth--;
      }
    }
  }

  // parse items from string.

  const vaultArrayStr = page.substring(startIndex, endIndex);

  let simplifiedArray = vaultArrayStr.replace(/{/g, '').replace(/}/g, '').replace(/"/g, '').split(',');
  simplifiedArray = simplifiedArray.map(x => x.split(':'));

  const items = [];
  let curItem = null;
  for (const row of simplifiedArray) {
    if (row.length < 2) {
      continue;
    }
    const [key, value] = row;
    if (key === 'pid') {
      if (curItem) {
        items.push(curItem);
      }
      curItem = {};
    } else if (key === 'name') {
      curItem.name = value;
    } else if (key === 'type') {
      curItem.type = value;
    } else if (key === 'earn') {
      curItem.earn = value;
    } else if (key === 'lpAddresses') {
      curItem.lpAddresses = value;
    }
  }

  items.push(curItem);

  // console.log(items);

  return items;
};
