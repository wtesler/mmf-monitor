module.exports = async function(key) {
  const {readSecret} = require("google-cloud-secrets");
  return await readSecret(`projects/153999569748/secrets/${key}/versions/latest`);
};
