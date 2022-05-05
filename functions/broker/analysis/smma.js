/**
 * Computes the Smoothed Moving Average of points in a list.
 *
 * @param list A list of numbers.
 * @param n The period of the SMMA. Will use latest points.
 */
module.exports = (list, n) => {
  const length = list.length;
  const lastValue = list[length - 1];

  if (length < n) {
    throw new Error(`Not enough points in list to handle period of ${n}`);
  }

  // Last n points.
  list = list.slice(length - n, length);

  // Sum points.
  const sum = list.reduce((a, b) => a + b, 0);

  // Simple average of points.
  const sma = sum / n;

  // Smoothed Moving Average.
  const smma = (sum - sma + lastValue) / n;

  return smma;
};
