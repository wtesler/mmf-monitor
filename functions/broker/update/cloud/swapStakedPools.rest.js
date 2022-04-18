const secretRest = require("../../../secrets/cloud/secretRest");
const swapStakedPools = require("../../../web3/swap/stake/swapStakedPools");

module.exports = [
  '',
  secretRest(async (req, res) => {
    const {parameterError} = require("cranny");

    const srcPool = req.body.srcPool;
    const dstPool = req.body.dstPool;
    const mnemonic = req.body.mnemonic;
    if (!srcPool || !dstPool || !mnemonic) {
      parameterError(req);
    }

    return await swapStakedPools(srcPool, dstPool, mnemonic);
  }, 'direct')
];
