(() => {
  const smma = require("../smma");
  try {
    const value = smma([1, 2, 4, 16, 32, 64, 128], 7);
    console.log(value);
  } catch (e) {
    console.error(e);
  }
})();
