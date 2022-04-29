const {rest} = require("cranny");
const compounderStep = require("../compounderStep");

module.exports = [
  '',
  rest(async (req, res) => {
    return await compounderStep();
  })
];
