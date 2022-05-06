const {rest} = require("cranny");
const monitorStep = require("../monitorStep");

module.exports = [
  '',
  rest(async (req, res) => {
    return await monitorStep();
  })
];
