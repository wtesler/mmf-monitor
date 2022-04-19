const secretRest = require("../../../secrets/cloud/secretRest");
const swapStakedPools = require("../../../web3/swap/stake/swapStakedPools");

module.exports = [
  '',
  secretRest(async (req, res) => {
    const {parameterError} = require("cranny");

    const srcPool = req.body.srcPool;
    const dstPool = req.body.dstPool;
    const mnemonic = req.body.mnemonic;
    const email = req.body.email;
    const signal = req.body.signal;
    if (!srcPool || !dstPool || !mnemonic || !email || !signal) {
      parameterError(req);
    }

    return await swapStakedPools(srcPool, dstPool, mnemonic, email, signal);
  }, 'direct')
];
