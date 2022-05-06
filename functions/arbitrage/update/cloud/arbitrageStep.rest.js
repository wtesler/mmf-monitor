const {rest} = require("cranny");
const arbitrageStep = require("../arbitrageStep");

module.exports = [
  '',
  rest(async (req, res) => {
    return await arbitrageStep();
  })
];
