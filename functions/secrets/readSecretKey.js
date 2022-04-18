module.exports = async function(key) {
  const {readSecret} = require("google-cloud-secrets");
  return await readSecret(`projects/348085923278/secrets/${key}/versions/latest`);
};
