(() => {
  const macdVelocity = require("../stratagies/macdStrategy");
  const value = macdVelocity([
    1.1291,
    1.1168,
    1.1147,
    1.1159,
    1.1127,
    1.1072,
    1.1032,
    1.1067
  ], 26, 12, 9, true);
  console.log(value);
})();
