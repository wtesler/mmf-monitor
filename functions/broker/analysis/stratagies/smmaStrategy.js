module.exports = (list, slow, fast) => {
  const smma = require('../smma');

  const slowSmma = smma(list, slow);
  const fastSmma = smma(list, fast);

  const diff = fastSmma - slowSmma;

  return diff;
};
