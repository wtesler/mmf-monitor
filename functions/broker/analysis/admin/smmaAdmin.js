(() => {
  const smma = require("../smma");
  const value = smma([1, 2, 4, 16, 32, 64, 128], 7);
  console.log(value);
})();
