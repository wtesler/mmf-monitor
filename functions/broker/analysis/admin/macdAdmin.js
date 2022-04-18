(() => {
  const macd = require("macd");
  const value = macd([1, 2, 4, 16, 32, 64, 128], 26, 12, 9);
  console.log(value);
})();
