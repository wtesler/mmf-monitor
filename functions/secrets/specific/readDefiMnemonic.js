module.exports = async function(num=1) {
  const {readSecret} = require("google-cloud-secrets");

  return await readSecret(`projects/348085923278/secrets/defi_mnemonic${num}/versions/latest`);
};
