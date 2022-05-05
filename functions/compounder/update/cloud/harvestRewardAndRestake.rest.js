const secretRest = require("../../../secrets/cloud/secretRest");
const harvestRewardAndRestake = require("../harvestRewardAndRestake");

module.exports = [
  '',
  secretRest(async (req, res) => {
    const {parameterError} = require("cranny");

    const walletData = req.body.walletData;

    if (!walletData) {
      parameterError(req);
    }

    return await harvestRewardAndRestake(walletData);
  }, 'direct')
];
