module.exports = (list, slow, fast, signal, verbose=false) => {
  const macd = require('macd');

  const macdResults = macd(list, slow, fast, signal);
  const histogram = macdResults.histogram;

  const histogramDiffs = [];
  for (let i = 1; i < histogram.length; i++) {
    histogramDiffs.push(histogram[i] - histogram[i - 1]);
  }

  let tendencyMult = 1;
  const lastSign = Math.sign(histogramDiffs[histogramDiffs.length - 2]);

  for (let i = histogramDiffs.length - 3; i >= 0; i--) {
    const diff = histogramDiffs[i];
    if (Math.sign(diff) === lastSign) {
      tendencyMult += 1;
    } else {
      break;
    }
  }

  const currentDiff = histogramDiffs[histogramDiffs.length - 1];

  if (verbose) {
    console.log(`HISTOGRAM: ${histogram}`);
    console.log(`HISTOGRAM DIFFS: ${histogramDiffs}`);
    console.log(`LAST SIGN: ${lastSign}`);
    console.log(`MULT: ${tendencyMult}`);
  }

  return currentDiff * tendencyMult;
};
