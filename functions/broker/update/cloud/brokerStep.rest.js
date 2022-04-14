const {rest} = require("cranny");
const brokerStep = require("../brokerStep");

module.exports = [
  '',
  rest(async (req, res) => {
    return await brokerStep();
  })
];
