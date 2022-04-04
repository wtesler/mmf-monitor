const {rest} = require("cranny");
const monitorVaultChanges = require("../monitorVaultChanges");

module.exports = [
  '',
  rest(async (req, res) => {
    return await monitorVaultChanges();
  })
];
