const secretRest = require("../../../secrets/cloud/secretRest");
const swapStakedPools = require("../../../web3/swap/stake/swapStakedPools");

module.exports = [
  '',
  secretRest(async (req, res) => {
    const {parameterError} = require("cranny");

    const bullPairToken = req.body.bullPairToken;
    const bearToken = req.body.bearToken;
    const mnemonic = req.body.mnemonic;
    const email = req.body.email;
    const signal = req.body.signal;

    if (!bullPairToken || !bearToken || !mnemonic || !email || !signal) {
      parameterError(req);
    }

    return await swapStakedPools(bullPairToken, bearToken, mnemonic, email, signal);
  }, 'direct')
];
