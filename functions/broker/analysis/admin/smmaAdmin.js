(() => {
  const smma = require("../smma");
  try {
    const value = smma([1, 2, 3, 4, 5], 3);
    console.log(value);
  } catch (e) {
    console.error(e);
  }
})();
